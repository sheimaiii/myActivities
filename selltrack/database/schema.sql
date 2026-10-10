CREATE DATABASE IF NOT EXISTS selltrack
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE selltrack;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','cashier','inventory') NOT NULL DEFAULT 'cashier',
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_name VARCHAR(150) NOT NULL,
  contact_number VARCHAR(50),
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_code VARCHAR(60) NOT NULL UNIQUE,
  product_name VARCHAR(150) NOT NULL,
  category_id INT NULL,
  supplier_id INT NULL,
  cost_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  selling_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 0,
  low_stock_level INT NOT NULL DEFAULT 5,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
  CONSTRAINT fk_product_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sales (
  sale_id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_number VARCHAR(30) NOT NULL UNIQUE,
  user_id INT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method ENUM('Cash','GCash','Card') NOT NULL DEFAULT 'Cash',
  amount_paid DECIMAL(12,2) NOT NULL DEFAULT 0,
  change_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sale_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sale_items (
  sale_item_id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_item_sale FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE,
  CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  inventory_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NULL,
  transaction_type ENUM('STOCK_IN','STOCK_OUT','SALE','ADJUSTMENT') NOT NULL,
  quantity INT NOT NULL,
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  reason VARCHAR(255),
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inv_product FOREIGN KEY (product_id) REFERENCES products(product_id),
  CONSTRAINT fk_inv_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

INSERT IGNORE INTO categories (category_name, description) VALUES
('Beverages','Drinks and beverages'),
('Snacks','Chips, biscuits and snacks'),
('School Supplies','Basic school supplies');

INSERT IGNORE INTO products
(product_code, product_name, category_id, cost_price, selling_price, stock_quantity, low_stock_level)
VALUES
('COKE1500','Coca-Cola 1.5L',1,60.00,85.00,50,10),
('PIA001','Piattos Cheese',2,18.00,25.00,25,8),
('PEN001','Ballpen Blue',3,8.00,12.00,40,10);
