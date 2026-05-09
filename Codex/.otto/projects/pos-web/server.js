const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup - Pag-setup ng SQLite database connection
const db = new sqlite3.Database('./pos.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Initialize database tables - Paglikha ng mga database tables kung wala pa
function initializeDatabase() {
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'cashier',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Products table
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT,
      stock INTEGER DEFAULT 0,
      barcode TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Sales table
    `CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total REAL NOT NULL,
      tax REAL DEFAULT 0,
      payment_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`,

    // Sale items table
    `CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )`,

    // Settings table
    `CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL
    )`
  ];

  let completed = 0;
  tables.forEach(sql => {
    db.run(sql, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        completed++;
        if (completed === tables.length) {
          // All tables created, now create default data
          createDefaultUser();
          insertSampleData();
        }
      }
    });
  });
}

// Create default admin user
function createDefaultUser() {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`,
    ['admin', hashedPassword, 'admin']);
}

// Insert sample products
function insertSampleData() {
  const products = [
    ['Apple', 1.50, 'Fruits', 50, '123456789'],
    ['Banana', 0.75, 'Fruits', 30, '987654321'],
    ['Orange Juice', 3.25, 'Beverages', 20, '456789123'],
    ['Bread', 2.50, 'Bakery', 15, '789123456'],
    ['Milk', 2.75, 'Dairy', 25, '321654987']
  ];

  products.forEach(product => {
    db.run(`INSERT OR IGNORE INTO products (name, price, category, stock, barcode) VALUES (?, ?, ?, ?, ?)`,
      product);
  });

  // Default settings
  db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, ['store_name', 'My Store']);
  db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, ['tax_rate', '8.25']);
  db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, ['currency', 'USD']);
}

// Authentication middleware - Middleware na nagve-verify ng JWT token para sa secure routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Routes

// Authentication routes
app.post('/api/auth/login', (req, res) => { // Login endpoint - Pangangasiwa ng user login at JWT token generation
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  });
});

app.post('/api/auth/register', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { username, password, role = 'cashier' } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, hashedPassword, role], function(err) {
      if (err) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      res.status(201).json({ id: this.lastID, username, role });
    });
});

// Product routes
app.get('/api/products', authenticateToken, (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR barcode = ?)';
    params.push(`%${search}%`, search);
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY name';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/products', authenticateToken, (req, res) => {
  const { name, price, category, stock, barcode } = req.body;

  db.run(`INSERT INTO products (name, price, category, stock, barcode)
          VALUES (?, ?, ?, ?, ?)`,
    [name, price, category, stock, barcode], function(err) {
      if (err) {
        return res.status(400).json({ error: 'Product creation failed' });
      }
      res.status(201).json({
        id: this.lastID,
        name,
        price,
        category,
        stock,
        barcode
      });
    });
});

app.put('/api/products/:id', authenticateToken, (req, res) => {
  const { name, price, category, stock, barcode } = req.body;

  db.run(`UPDATE products SET name = ?, price = ?, category = ?,
          stock = ?, barcode = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [name, price, category, stock, barcode, req.params.id], function(err) {
      if (err) {
        return res.status(400).json({ error: 'Product update failed' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully' });
    });
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// Sales routes
app.post('/api/sales', authenticateToken, (req, res) => { // Sales endpoint - Pagproseso ng bagong benta at pag-update ng inventory
  const { items, paymentMethod } = req.body;
  const userId = req.user.id;

  // Calculate totals
  let subtotal = 0;
  items.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  // Get tax rate from settings
  db.get('SELECT value FROM settings WHERE key = ?', ['tax_rate'], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const taxRate = parseFloat(row?.value || 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    // Insert sale
    db.run('INSERT INTO sales (user_id, total, tax, payment_method) VALUES (?, ?, ?, ?)',
      [userId, total, tax, paymentMethod], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Sale creation failed' });
        }

        const saleId = this.lastID;

        // Insert sale items and update inventory
        let completed = 0;
        items.forEach(item => {
          db.run('INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [saleId, item.id, item.quantity, item.price]);

          // Update product stock
          db.run('UPDATE products SET stock = stock - ? WHERE id = ?',
            [item.quantity, item.id]);

          completed++;
          if (completed === items.length) {
            res.status(201).json({
              id: saleId,
              total,
              tax,
              items: items.length
            });
          }
        });
      });
  });
});

app.get('/api/sales', authenticateToken, (req, res) => {
  const { startDate, endDate } = req.query;
  let query = `SELECT s.*, u.username,
               GROUP_CONCAT(si.quantity || 'x ' || p.name) as items_summary
               FROM sales s
               LEFT JOIN users u ON s.user_id = u.id
               LEFT JOIN sale_items si ON s.id = si.sale_id
               LEFT JOIN products p ON si.product_id = p.id
               WHERE 1=1`;
  const params = [];

  if (startDate) {
    query += ' AND DATE(s.created_at) >= DATE(?)';
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND DATE(s.created_at) <= DATE(?)';
    params.push(endDate);
  }

  query += ' GROUP BY s.id ORDER BY s.created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Settings routes
app.get('/api/settings', authenticateToken, (req, res) => {
  db.all('SELECT key, value FROM settings', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  });
});

app.put('/api/settings', authenticateToken, (req, res) => {
  const settings = req.body;
  let completed = 0;
  const total = Object.keys(settings).length;

  Object.entries(settings).forEach(([key, value]) => {
    db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value], () => {
        completed++;
        if (completed === total) {
          res.json({ message: 'Settings updated successfully' });
        }
      });
  });
});

// Dashboard stats
app.get('/api/dashboard', authenticateToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  // Today's sales
  db.get('SELECT SUM(total) as today_sales, COUNT(*) as today_transactions FROM sales WHERE DATE(created_at) = ?',
    [today], (err, todayStats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Total products
      db.get('SELECT COUNT(*) as total_products, SUM(stock) as total_stock FROM products',
        [], (err, productStats) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          // Low stock products
          db.all('SELECT name, stock FROM products WHERE stock < 10 ORDER BY stock ASC LIMIT 5',
            [], (err, lowStock) => {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }

              res.json({
                todaySales: todayStats.today_sales || 0,
                todayTransactions: todayStats.today_transactions || 0,
                totalProducts: productStats.total_products || 0,
                totalStock: productStats.total_stock || 0,
                lowStockProducts: lowStock
              });
            });
        });
    });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`POS API server running on port ${PORT}`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
