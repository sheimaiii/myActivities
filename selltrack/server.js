require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true
});

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Login required." });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired session." });
  }
}

function roles(...allowed) {
  return (req, res, next) => {
    if (!allowed.includes(req.user.role)) return res.status(403).json({ message: "Access denied." });
    next();
  };
}

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE username=? AND status='active'", [username]);
    if (!rows.length) return res.status(401).json({ message: "Invalid username or password." });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid username or password." });
    const payload = { user_id: user.user_id, full_name: user.full_name, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, user: payload });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post("/api/setup/admin", async (req, res) => {
  try {
    const [count] = await pool.query("SELECT COUNT(*) AS c FROM users");
    if (count[0].c > 0) return res.status(409).json({ message: "A user already exists." });
    const { full_name, username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (full_name, username, password_hash, role) VALUES (?,?,?,'admin')",
      [full_name, username, hash]);
    res.json({ message: "Admin account created." });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get("/api/dashboard", auth, async (req, res) => {
  try {
    const [[sales]] = await pool.query("SELECT COALESCE(SUM(total_amount),0) AS totalSales, COUNT(*) AS transactions FROM sales WHERE DATE(sale_date)=CURDATE()");
    const [[products]] = await pool.query("SELECT COUNT(*) AS totalProducts FROM products WHERE status='active'");
    const [[low]] = await pool.query("SELECT COUNT(*) AS lowStock FROM products WHERE status='active' AND stock_quantity <= low_stock_level");
    const [recent] = await pool.query(`
      SELECT s.transaction_number, s.total_amount, s.payment_method, s.sale_date, COALESCE(u.full_name,'Unknown') AS cashier
      FROM sales s LEFT JOIN users u ON u.user_id=s.user_id
      ORDER BY s.sale_id DESC LIMIT 8`);
    res.json({ ...sales, ...products, ...low, recent });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get("/api/products", auth, async (req, res) => {
  const [rows] = await pool.query(`
    SELECT p.*, c.category_name, s.supplier_name
    FROM products p
    LEFT JOIN categories c ON c.category_id=p.category_id
    LEFT JOIN suppliers s ON s.supplier_id=p.supplier_id
    ORDER BY p.product_id DESC`);
  res.json(rows);
});

app.post("/api/products", auth, roles("admin","inventory"), async (req, res) => {
  try {
    const { product_code, product_name, category_id, supplier_id, cost_price, selling_price, stock_quantity, low_stock_level } = req.body;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [r] = await conn.query(`
        INSERT INTO products
        (product_code,product_name,category_id,supplier_id,cost_price,selling_price,stock_quantity,low_stock_level)
        VALUES (?,?,?,?,?,?,?,?)`,
        [product_code,product_name,category_id||null,supplier_id||null,cost_price,selling_price,stock_quantity,low_stock_level]);
      if (Number(stock_quantity) > 0) {
        await conn.query(`INSERT INTO inventory_transactions
          (product_id,user_id,transaction_type,quantity,previous_stock,new_stock,reason)
          VALUES (?,?, 'STOCK_IN',?,?,?,'Initial stock')`,
          [r.insertId, req.user.user_id, stock_quantity, 0, stock_quantity]);
      }
      await conn.commit();
      res.status(201).json({ message:"Product added." });
    } catch(e) { await conn.rollback(); throw e; } finally { conn.release(); }
  } catch (e) { res.status(400).json({ message: e.message }); }
});

app.put("/api/products/:id", auth, roles("admin","inventory"), async (req,res)=>{
  try {
    const { product_code, product_name, category_id, supplier_id, cost_price, selling_price, low_stock_level, status } = req.body;
    await pool.query(`UPDATE products SET product_code=?,product_name=?,category_id=?,supplier_id=?,
      cost_price=?,selling_price=?,low_stock_level=?,status=? WHERE product_id=?`,
      [product_code,product_name,category_id||null,supplier_id||null,cost_price,selling_price,low_stock_level,status,req.params.id]);
    res.json({message:"Product updated."});
  } catch(e){ res.status(400).json({message:e.message}); }
});

app.delete("/api/products/:id", auth, roles("admin"), async (req,res)=>{
  try {
    await pool.query("UPDATE products SET status='inactive' WHERE product_id=?", [req.params.id]);
    res.json({message:"Product deactivated."});
  } catch(e){ res.status(400).json({message:e.message}); }
});

app.post("/api/inventory", auth, roles("admin","inventory"), async (req,res)=>{
  const { product_id, type, quantity, reason } = req.body;
  if (!["STOCK_IN","STOCK_OUT"].includes(type) || Number(quantity) <= 0)
    return res.status(400).json({message:"Invalid inventory adjustment."});
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[p]] = await conn.query("SELECT stock_quantity FROM products WHERE product_id=? FOR UPDATE",[product_id]);
    if (!p) throw new Error("Product not found.");
    const previous = p.stock_quantity;
    const change = type === "STOCK_IN" ? Number(quantity) : -Number(quantity);
    const next = previous + change;
    if (next < 0) throw new Error("Insufficient stock.");
    await conn.query("UPDATE products SET stock_quantity=? WHERE product_id=?",[next,product_id]);
    await conn.query(`INSERT INTO inventory_transactions
      (product_id,user_id,transaction_type,quantity,previous_stock,new_stock,reason)
      VALUES (?,?,?,?,?,?,?)`,[product_id,req.user.user_id,type,quantity,previous,next,reason||null]);
    await conn.commit();
    res.json({message:"Inventory updated.", stock:next});
  } catch(e){ await conn.rollback(); res.status(400).json({message:e.message}); }
  finally { conn.release(); }
});

app.get("/api/sales", auth, async (req,res)=>{
  const [rows] = await pool.query(`
    SELECT s.*, COALESCE(u.full_name,'Unknown') AS cashier
    FROM sales s LEFT JOIN users u ON u.user_id=s.user_id
    ORDER BY s.sale_id DESC LIMIT 100`);
  res.json(rows);
});

app.post("/api/sales", auth, roles("admin","cashier"), async (req,res)=>{
  const { items, discount=0, payment_method="Cash", amount_paid=0 } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({message:"Cart is empty."});
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    let subtotal = 0;
    const locked = [];
    for (const item of items) {
      const [[p]] = await conn.query("SELECT * FROM products WHERE product_id=? AND status='active' FOR UPDATE",[item.product_id]);
      if (!p) throw new Error("A product no longer exists.");
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty <= 0) throw new Error("Invalid quantity.");
      if (p.stock_quantity < qty) throw new Error(`Not enough stock for ${p.product_name}.`);
      const line = Number(p.selling_price) * qty;
      subtotal += line;
      locked.push({p, qty, line});
    }
    const total = Math.max(0, subtotal - Number(discount));
    if (payment_method === "Cash" && Number(amount_paid) < total) throw new Error("Insufficient payment.");
    const change = payment_method === "Cash" ? Number(amount_paid) - total : 0;
    const transaction = "TXN-" + Date.now();
    const [sale] = await conn.query(`INSERT INTO sales
      (transaction_number,user_id,subtotal,discount,total_amount,payment_method,amount_paid,change_amount)
      VALUES (?,?,?,?,?,?,?,?)`,
      [transaction,req.user.user_id,subtotal,discount,total,payment_method,amount_paid,change]);
    for (const x of locked) {
      const next = x.p.stock_quantity - x.qty;
      await conn.query(`INSERT INTO sale_items (sale_id,product_id,quantity,unit_price,subtotal)
        VALUES (?,?,?,?,?)`,[sale.insertId,x.p.product_id,x.qty,x.p.selling_price,x.line]);
      await conn.query("UPDATE products SET stock_quantity=? WHERE product_id=?",[next,x.p.product_id]);
      await conn.query(`INSERT INTO inventory_transactions
        (product_id,user_id,transaction_type,quantity,previous_stock,new_stock,reason)
        VALUES (?,?, 'SALE',?,?,?,'POS sale')`,
        [x.p.product_id,req.user.user_id,x.qty,x.p.stock_quantity,next]);
    }
    await conn.commit();
    res.status(201).json({message:"Sale completed.", transaction_number:transaction, total, change});
  } catch(e){ await conn.rollback(); res.status(400).json({message:e.message}); }
  finally { conn.release(); }
});

app.get("/api/categories", auth, async (req,res)=>{
  const [rows]=await pool.query("SELECT * FROM categories ORDER BY category_name");
  res.json(rows);
});

app.get("/api/users", auth, roles("admin"), async (req,res)=>{
  const [rows]=await pool.query("SELECT user_id,full_name,username,role,status,created_at FROM users ORDER BY user_id DESC");
  res.json(rows);
});

app.post("/api/users", auth, roles("admin"), async (req,res)=>{
  try {
    const {full_name,username,password,role}=req.body;
    const hash=await bcrypt.hash(password,10);
    await pool.query("INSERT INTO users(full_name,username,password_hash,role) VALUES(?,?,?,?)",[full_name,username,hash,role]);
    res.status(201).json({message:"User created."});
  } catch(e){ res.status(400).json({message:e.message}); }
});

app.get("/api/reports", auth, roles("admin"), async (req,res)=>{
  const [[summary]]=await pool.query(`SELECT
    COALESCE(SUM(total_amount),0) totalSales,
    COUNT(*) transactions,
    COALESCE(SUM(total_amount-discount),0) netSales
    FROM sales WHERE sale_date >= CURDATE() - INTERVAL 30 DAY`);
  const [best]=await pool.query(`
    SELECT p.product_name, SUM(si.quantity) qty
    FROM sale_items si JOIN products p ON p.product_id=si.product_id
    JOIN sales s ON s.sale_id=si.sale_id
    WHERE s.sale_date >= CURDATE() - INTERVAL 30 DAY
    GROUP BY p.product_id ORDER BY qty DESC LIMIT 10`);
  res.json({summary,best});
});

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port=Number(process.env.PORT||3000);
app.listen(port,()=>console.log(`SellTrack running at http://localhost:${port}`));
