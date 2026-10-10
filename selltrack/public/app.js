const $=s=>document.querySelector(s);
const api=async(path,options={})=>{
  const token=localStorage.getItem("selltrack_token");
  options.headers={...(options.headers||{}),"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{})};
  const r=await fetch(path,options); const data=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(data.message||"Request failed"); return data;
};
let currentUser=JSON.parse(localStorage.getItem("selltrack_user")||"null");
let products=[],cart=[];

function toast(msg){$("#toast").textContent=msg;$("#toast").classList.add("toast-show");setTimeout(()=>$("#toast").classList.remove("toast-show"),2500)}
function money(n){return `₱${Number(n||0).toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2})}`}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

$("#loginForm").addEventListener("submit",async e=>{
 e.preventDefault();$("#loginMsg").textContent="";
 try{const d=await api("/api/auth/login",{method:"POST",body:JSON.stringify({username:$("#username").value,password:$("#password").value})});
 localStorage.setItem("selltrack_token",d.token);localStorage.setItem("selltrack_user",JSON.stringify(d.user));currentUser=d.user;showApp();
 }catch(err){$("#loginMsg").textContent=err.message}
});
$("#logout").onclick=()=>{localStorage.clear();location.reload()};
$("#nav").addEventListener("click",e=>{const b=e.target.closest("button[data-page]");if(b)loadPage(b.dataset.page)});
function showApp(){
 $("#loginView").classList.add("hidden");$("#appView").classList.remove("hidden");
 $("#userBox").innerHTML=`<strong>${escapeHtml(currentUser.full_name)}</strong><br><span>${escapeHtml(currentUser.role)}</span>`;
 [...$("#nav").children].forEach(b=>b.style.display="block");
 if(currentUser.role!=="admin") [...$("#nav").querySelectorAll('[data-page="users"],[data-page="reports"]')].forEach(b=>b.style.display="none");
 loadPage("dashboard");
}
async function loadPage(page){
 [...$("#nav").children].forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 $("#pageTitle").textContent={dashboard:"Dashboard",pos:"POS / Cashier",products:"Products",inventory:"Inventory",sales:"Sales History",reports:"Reports",users:"Users"}[page];
 try{({dashboard:dashboard,pos:pos,products:productsPage,inventory:inventoryPage,sales:salesPage,reports:reportsPage,users:usersPage}[page])()}
 catch(e){toast(e.message)}
}

async function dashboard(){
 const d=await api("/api/dashboard");
 $("#content").innerHTML=`<div class="grid cards">
 <div class="card metric"><div class="label">Today's Sales</div><div class="value">${money(d.totalSales)}</div></div>
 <div class="card metric"><div class="label">Transactions</div><div class="value">${d.transactions}</div></div>
 <div class="card metric"><div class="label">Active Products</div><div class="value">${d.totalProducts}</div></div>
 <div class="card metric"><div class="label">Low Stock</div><div class="value">${d.lowStock}</div></div></div>
 <div class="card" style="margin-top:18px"><div class="toolbar"><h2>Recent Transactions</h2><button class="btn secondary" onclick="loadPage('sales')">View all</button></div>
 <table><thead><tr><th>Transaction</th><th>Cashier</th><th>Total</th><th>Payment</th><th>Date</th></tr></thead><tbody>
 ${d.recent.map(x=>`<tr><td>${x.transaction_number}</td><td>${escapeHtml(x.cashier)}</td><td>${money(x.total_amount)}</td><td>${x.payment_method}</td><td>${new Date(x.sale_date).toLocaleString()}</td></tr>`).join("")||"<tr><td colspan=5 class=empty>No sales yet.</td></tr>"}
 </tbody></table></div>`;
}

async function productsPage(){
 products=await api("/api/products");
 $("#content").innerHTML=`<div class="card"><div class="toolbar"><div><h2>Products</h2><p class="muted">Add and manage products.</p></div>
 <div class="actions"><input id="productSearch" placeholder="Search products..." oninput="renderProductTable()">${["admin","inventory"].includes(currentUser.role)?'<button class="btn primary" onclick="productModal()">+ Add Product</button>':""}</div></div>
 <div id="productTable"></div></div>`;renderProductTable();
}
function stockBadge(p){if(p.stock_quantity<=0)return '<span class="badge out">OUT OF STOCK</span>';if(p.stock_quantity<=p.low_stock_level)return '<span class="badge low">LOW STOCK</span>';return '<span class="badge ok">IN STOCK</span>'}
function renderProductTable(){
 const q=($("#productSearch")?.value||"").toLowerCase();
 const list=products.filter(p=>(p.product_name+" "+p.product_code).toLowerCase().includes(q));
 $("#productTable").innerHTML=`<table><thead><tr><th>Code</th><th>Product</th><th>Category</th><th>Cost</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>
 ${list.map(p=>`<tr><td>${escapeHtml(p.product_code)}</td><td><strong>${escapeHtml(p.product_name)}</strong></td><td>${escapeHtml(p.category_name||"—")}</td><td>${money(p.cost_price)}</td><td>${money(p.selling_price)}</td><td>${p.stock_quantity}</td><td>${stockBadge(p)}</td><td>${currentUser.role!=="cashier"?`<button class="btn secondary" onclick="productModal(${p.product_id})">Edit</button> ${currentUser.role==="admin"?`<button class="btn danger" onclick="deleteProduct(${p.product_id})">Delete</button>`:""}`:"—"}</td></tr>`).join("")||'<tr><td colspan="8" class="empty">No products found.</td></tr>'}
 </tbody></table>`;
}
async function productModal(id=null){
 const p=id?products.find(x=>x.product_id===id):{};
 const cats=await api("/api/categories");
 const modal=document.createElement("div");modal.className="modal-backdrop";modal.id="modal";
 modal.innerHTML=`<div class="modal"><h2>${id?"Edit":"Add"} Product</h2><form id="productForm">
 <div class="form-grid"><label>Product Code<input name="product_code" required value="${escapeHtml(p.product_code||"")}"></label>
 <label>Product Name<input name="product_name" required value="${escapeHtml(p.product_name||"")}"></label>
 <label>Category<select name="category_id"><option value="">No category</option>${cats.map(c=>`<option value="${c.category_id}" ${p.category_id==c.category_id?"selected":""}>${escapeHtml(c.category_name)}</option>`).join("")}</select></label>
 <label>Cost Price<input name="cost_price" type="number" step=".01" min="0" required value="${p.cost_price??0}"></label>
 <label>Selling Price<input name="selling_price" type="number" step=".01" min="0" required value="${p.selling_price??0}"></label>
 ${id?"":'<label>Initial Stock<input name="stock_quantity" type="number" min="0" required value="0"></label>'}
 <label>Low Stock Level<input name="low_stock_level" type="number" min="0" required value="${p.low_stock_level??5}"></label>
 ${id?`<label>Status<select name="status"><option value="active" ${p.status==="active"?"selected":""}>Active</option><option value="inactive" ${p.status==="inactive"?"selected":""}>Inactive</option></select></label>`:""}
 </div><div class="form-actions"><button type="button" class="btn secondary" onclick="$('#modal').remove()">Cancel</button><button class="btn primary">${id?"Save Changes":"Add Product"}</button></div></form></div>`;
 document.body.appendChild(modal);
 $("#productForm").onsubmit=async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));["category_id","cost_price","selling_price","stock_quantity","low_stock_level"].forEach(k=>{if(data[k]!==undefined)data[k]=Number(data[k])||0});
 try{await api(id?`/api/products/${id}`:"/api/products",{method:id?"PUT":"POST",body:JSON.stringify(data)});modal.remove();toast(id?"Product updated":"Product added");productsPage()}catch(err){toast(err.message)}};
}
async function deleteProduct(id){if(!confirm("Deactivate this product?"))return;try{await api("/api/products/"+id,{method:"DELETE"});toast("Product deactivated");productsPage()}catch(e){toast(e.message)}}

async function inventoryPage(){
 products=await api("/api/products");
 $("#content").innerHTML=`<div class="card"><div class="toolbar"><div><h2>Inventory</h2><p class="muted">Monitor stock and record stock movement.</p></div><button class="btn primary" onclick="inventoryModal()">Adjust Stock</button></div>
 <table><thead><tr><th>Product</th><th>Code</th><th>Stock</th><th>Low Level</th><th>Status</th></tr></thead><tbody>
 ${products.filter(p=>p.status==="active").map(p=>`<tr><td>${escapeHtml(p.product_name)}</td><td>${escapeHtml(p.product_code)}</td><td><strong>${p.stock_quantity}</strong></td><td>${p.low_stock_level}</td><td>${stockBadge(p)}</td></tr>`).join("")}</tbody></table></div>`;
}
async function inventoryModal(){
 const modal=document.createElement("div");modal.className="modal-backdrop";modal.id="modal";
 modal.innerHTML=`<div class="modal"><h2>Adjust Inventory</h2><form id="invForm"><div class="form-grid">
 <label class="fullrow">Product<select name="product_id" required>${products.filter(p=>p.status==="active").map(p=>`<option value="${p.product_id}">${escapeHtml(p.product_name)} — ${p.stock_quantity} in stock</option>`).join("")}</select></label>
 <label>Action<select name="type"><option value="STOCK_IN">Stock In</option><option value="STOCK_OUT">Stock Out</option></select></label>
 <label>Quantity<input name="quantity" type="number" min="1" required></label>
 <label class="fullrow">Reason<input name="reason" placeholder="New delivery, damaged item, etc."></label>
 </div><div class="form-actions"><button type="button" class="btn secondary" onclick="$('#modal').remove()">Cancel</button><button class="btn primary">Update Stock</button></div></form></div>`;
 document.body.appendChild(modal);
 $("#invForm").onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));d.product_id=Number(d.product_id);d.quantity=Number(d.quantity);try{await api("/api/inventory",{method:"POST",body:JSON.stringify(d)});modal.remove();toast("Inventory updated");inventoryPage()}catch(err){toast(err.message)}};
}

async function pos(){
 products=await api("/api/products");cart=[];
 $("#content").innerHTML=`<div class="pos"><div class="card"><div class="toolbar"><h2>Products</h2><input id="posSearch" placeholder="Search..." oninput="renderPos()"></div><div id="posProducts" class="product-grid"></div></div>
 <div class="card cart"><h2>Current Sale</h2><div id="cartItems" class="cart-items"></div><div class="summary"><div class="sumline"><span>Subtotal</span><strong id="subtotal">₱0.00</strong></div>
 <label>Discount<input id="discount" type="number" min="0" step=".01" value="0" oninput="renderCart()"></label>
 <div class="sumline total"><span>Total</span><span id="total">₱0.00</span></div><button class="btn primary full" onclick="checkout()">Checkout</button></div></div></div>`;renderPos();renderCart();
}
function renderPos(){
 const q=($("#posSearch")?.value||"").toLowerCase();
 $("#posProducts").innerHTML=products.filter(p=>p.status==="active"&&p.stock_quantity>0&&(p.product_name+" "+p.product_code).toLowerCase().includes(q)).map(p=>`<button class="product-btn" onclick="addToCart(${p.product_id})"><strong>${escapeHtml(p.product_name)}</strong><span>${money(p.selling_price)} · ${p.stock_quantity} left</span></button>`).join("")||'<div class="empty">No products available.</div>';
}
function addToCart(id){const p=products.find(x=>x.product_id===id);const x=cart.find(x=>x.product_id===id);if(x){if(x.quantity<p.stock_quantity)x.quantity++;else return toast("Maximum stock reached")}else cart.push({product_id:id,name:p.product_name,price:Number(p.selling_price),quantity:1,max:p.stock_quantity});renderCart()}
function renderCart(){
 const el=$("#cartItems");if(!el)return;
 el.innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div><strong>${escapeHtml(x.name)}</strong><br><span class="muted">${money(x.price)} each</span></div><div class="qty"><button onclick="changeQty(${x.product_id},-1)">−</button><span>${x.quantity}</span><button onclick="changeQty(${x.product_id},1)">+</button><button class="btn danger" style="padding:5px 8px" onclick="removeCart(${x.product_id})">×</button></div></div>`).join(""):'<div class="empty">Cart is empty.</div>';
 const sub=cart.reduce((a,x)=>a+x.price*x.quantity,0),dis=Number($("#discount")?.value||0),total=Math.max(0,sub-dis);
 if($("#subtotal"))$("#subtotal").textContent=money(sub);if($("#total"))$("#total").textContent=money(total);
}
function changeQty(id,d){const x=cart.find(x=>x.product_id===id);if(!x)return;x.quantity+=d;if(x.quantity<=0)cart=cart.filter(i=>i.product_id!==id);else if(x.quantity>x.max)x.quantity=x.max;renderCart()}
function removeCart(id){cart=cart.filter(x=>x.product_id!==id);renderCart()}
async function checkout(){
 if(!cart.length)return toast("Cart is empty.");
 const sub=cart.reduce((a,x)=>a+x.price*x.quantity,0),discount=Number($("#discount").value||0),total=Math.max(0,sub-discount);
 const modal=document.createElement("div");modal.className="modal-backdrop";modal.id="modal";
 modal.innerHTML=`<div class="modal"><h2>Checkout</h2><p class="muted">Total amount: <strong>${money(total)}</strong></p><form id="payForm">
 <label>Payment Method<select name="payment_method" id="paymentMethod"><option>Cash</option><option>GCash</option><option>Card</option></select></label>
 <label>Amount Paid<input name="amount_paid" id="amountPaid" type="number" min="0" step=".01" value="${total}" required></label>
 <div class="card" style="background:#f8fafc"><strong>Change: <span id="change">${money(0)}</span></strong></div>
 <div class="form-actions"><button type="button" class="btn secondary" onclick="$('#modal').remove()">Cancel</button><button class="btn primary">Complete Sale</button></div></form></div>`;
 document.body.appendChild(modal);
 const calc=()=>{const pm=$("#paymentMethod").value,paid=Number($("#amountPaid").value||0);$("#change").textContent=money(pm==="Cash"?Math.max(0,paid-total):0)};
 $("#amountPaid").oninput=calc;$("#paymentMethod").onchange=calc;
 $("#payForm").onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));d.amount_paid=Number(d.amount_paid);d.discount=discount;d.items=cart.map(x=>({product_id:x.product_id,quantity:x.quantity}));
 try{const r=await api("/api/sales",{method:"POST",body:JSON.stringify(d)});modal.remove();toast(`Sale ${r.transaction_number} completed`);pos()}catch(err){toast(err.message)}};
}

async function salesPage(){
 const rows=await api("/api/sales");
 $("#content").innerHTML=`<div class="card"><div class="toolbar"><div><h2>Sales History</h2><p class="muted">Latest 100 transactions.</p></div></div>
 <table><thead><tr><th>Transaction</th><th>Cashier</th><th>Total</th><th>Payment</th><th>Paid</th><th>Change</th><th>Date</th></tr></thead><tbody>
 ${rows.map(x=>`<tr><td>${x.transaction_number}</td><td>${escapeHtml(x.cashier)}</td><td><strong>${money(x.total_amount)}</strong></td><td>${x.payment_method}</td><td>${money(x.amount_paid)}</td><td>${money(x.change_amount)}</td><td>${new Date(x.sale_date).toLocaleString()}</td></tr>`).join("")||'<tr><td colspan="7" class="empty">No transactions.</td></tr>'}
 </tbody></table></div>`;
}
async function reportsPage(){
 const d=await api("/api/reports");
 $("#content").innerHTML=`<div class="grid cards"><div class="card metric"><div class="label">30-Day Sales</div><div class="value">${money(d.summary.totalSales)}</div></div><div class="card metric"><div class="label">Transactions</div><div class="value">${d.summary.transactions}</div></div><div class="card metric"><div class="label">Net Sales</div><div class="value">${money(d.summary.netSales)}</div></div><div class="card metric"><div class="label">Period</div><div class="value" style="font-size:20px">30 days</div></div></div>
 <div class="card" style="margin-top:18px"><h2>Best-Selling Products</h2><table><thead><tr><th>Product</th><th>Units Sold</th></tr></thead><tbody>${d.best.map(x=>`<tr><td>${escapeHtml(x.product_name)}</td><td>${x.qty}</td></tr>`).join("")||'<tr><td colspan="2" class="empty">No sales data.</td></tr>'}</tbody></table></div>`;
}
async function usersPage(){
 const rows=await api("/api/users");
 $("#content").innerHTML=`<div class="card"><div class="toolbar"><div><h2>Users</h2><p class="muted">Manage system accounts.</p></div><button class="btn primary" onclick="userModal()">+ Add User</button></div>
 <table><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Status</th><th>Created</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${escapeHtml(x.full_name)}</td><td>${escapeHtml(x.username)}</td><td>${x.role}</td><td>${x.status}</td><td>${new Date(x.created_at).toLocaleDateString()}</td></tr>`).join("")}</tbody></table></div>`;
}
function userModal(){
 const modal=document.createElement("div");modal.className="modal-backdrop";modal.id="modal";
 modal.innerHTML=`<div class="modal"><h2>Add User</h2><form id="userForm"><div class="form-grid">
 <label>Full Name<input name="full_name" required></label><label>Username<input name="username" required></label>
 <label>Password<input name="password" type="password" minlength="6" required></label>
 <label>Role<select name="role"><option value="cashier">Cashier</option><option value="inventory">Inventory Staff</option><option value="admin">Admin</option></select></label>
 </div><div class="form-actions"><button type="button" class="btn secondary" onclick="$('#modal').remove()">Cancel</button><button class="btn primary">Create User</button></div></form></div>`;
 document.body.appendChild(modal);
 $("#userForm").onsubmit=async e=>{e.preventDefault();try{await api("/api/users",{method:"POST",body:JSON.stringify(Object.fromEntries(new FormData(e.target)))});modal.remove();toast("User created");usersPage()}catch(err){toast(err.message)}}
}
setInterval(()=>{$("#clock").textContent=new Date().toLocaleString()},1000);
if(localStorage.getItem("selltrack_token")&&currentUser)showApp();
