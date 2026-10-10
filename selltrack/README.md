# SellTrack

Sales, Inventory & POS Management System using Node.js + Express + MySQL + HTML/CSS/JavaScript.

## 1. Install dependencies

Open the VS Code terminal in this folder:

```bash
npm install
```

## 2. Create MySQL database

Open MySQL Workbench, create/open a SQL tab, then run:

```sql
SOURCE /full/path/to/database/schema.sql;
```

Or copy/paste `database/schema.sql` into Workbench and execute it.

## 3. Configure environment

Copy `.env.example` to `.env` and set:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=selltrack
JWT_SECRET=your_long_random_secret

## 4. Create first admin

Start the server:

```bash
npm start
```

Then use a REST client/browser console to POST:

POST http://localhost:3000/api/setup/admin

JSON:
{
  "full_name": "System Administrator",
  "username": "admin",
  "password": "admin123"
}

After that, open:

http://localhost:3000

Login with admin / admin123.

IMPORTANT: Change the password for any real deployment.

## Main features

- Login and JWT authentication
- Admin, Cashier and Inventory roles
- Dashboard
- Product CRUD
- Inventory stock-in / stock-out
- Low-stock detection
- POS cart and checkout
- Cash / GCash / Card payment recording
- Automatic stock deduction after sales
- Sales history
- 30-day reports
- User management
- MySQL transactions for sales and inventory consistency
