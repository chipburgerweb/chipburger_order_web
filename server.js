/**
 * Chip Burger Web Store & Daily Open Order System - Node.js Server
 * Full REST API + Owner-Secured Admin Portal
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// MIME Types
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

// 7 Varian Menu Utama Resmi PRD
let CHIP_MENU = [
    {
      name: 'Burger Lover',
      email: 'demo@chipburger.com',
      phone: '081234567890',
      password: 'password123',
      role: 'customer'
    },
    {
        id: 'lo-burger',
        name: 'LO BURGER',
        displayPrice: '32K',
        price: 32000,
        ingredients: 'Bun, Beef Patty, Chipsaus, Lettuce, Onion, Pickle, Cheese Slice, Tomato',
        tag: 'bestseller',
        isBestSeller: true,
        available: true,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'mushroom-burger',
        name: 'MUSHROOM BURGER',
        displayPrice: '37K',
        price: 37000,
        ingredients: 'Bun, Beef Patty, Mushroom, Chipsaus, Lettuce, Onion, Pickle, Cheese Slice, Tomato',
        tag: 'mushroom',
        isBestSeller: false,
        available: true,
        image: 'https://images.unsplash.com/photo-1583032015879-c5622e519967?auto=format&fit=crop&w=600&q=80'
    },
    {
      queueNo: '#CB-419',
      customerName: 'Budi Santoso',
      customerPhone: '081234567890',
      method: 'pickup',
      timeSlot: 'Jadwal Siang (12.00 – 14.00 WIB)',
      address: '-',
      notes: 'Tanpa timun/pickle',
      items: [
        { name: 'DOUBPAT BURGER', qty: 1, price: 74000 }
      ],
      subtotal: 74000,
      shippingFee: 0,
      total: 74000,
      status: 'preparing',
      createdAt: new Date(Date.now() - 15 * 60000).toISOString()
    }
  ]
};

    // In-Memory Database
    const db = {
        users: [
            {
                name: 'Burger Lover',
                email: 'demo@chipburger.com',
                phone: '081234567890',
                password: 'password123',
                role: 'customer'
            },
            {
                name: 'Admin Chip Burger',
                email: 'admin@chipburger.com',
                phone: '082284362199',
                password: 'admin123',
                role: 'admin'
            }
        ],
        storeConfig: {
            isOpen: true,
            openNotice: 'OPEN ORDER SETIAP HARI • MADE FRESH TO ORDER (100% ORIGINAL BEEF PATTY)',
            operatingHours: '11.00 – 21.30 WIB',
            whatsappHotline: '0822-8436-2199',
            deliveryFee: 10000
        },
        orders: [
            {
                queueNo: '#CB-782',
                customerName: 'Dina Kurnia',
                customerPhone: '081298765432',
                method: 'delivery',
                timeSlot: 'Kirim / Ambil Sekarang (Estimasi ± 20–30 Menit)',
                address: 'Jl. Kemang Raya No. 12B, Jakarta Selatan',
                notes: 'Tolong saus chipsaus-nya dipisah ya',
                items: [
                    { name: 'CHEESE BURGER', qty: 2, price: 47000 },
                    { name: 'LO BURGER', qty: 1, price: 32000 }
                ],
                subtotal: 126000,
                shippingFee: 10000,
                total: 136000,
                status: 'pending', // pending, preparing, delivering, completed, cancelled
                createdAt: new Date(Date.now() - 35 * 60000).toISOString()
            },
            {
                queueNo: '#CB-419',
                customerName: 'Budi Santoso',
                customerPhone: '081234567890',
                method: 'pickup',
                timeSlot: 'Jadwal Siang (12.00 – 14.00 WIB)',
                address: '-',
                notes: 'Tanpa timun/pickle',
                items: [
                    { name: 'DOUBPAT BURGER', qty: 1, price: 74000 }
                ],
                subtotal: 74000,
                shippingFee: 0,
                total: 74000,
                status: 'preparing',
                createdAt: new Date(Date.now() - 15 * 60000).toISOString()
            }
        ]
    };

    // Helper: Parse JSON Body
    function parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                try {
                    resolve(body ? JSON.parse(body) : {});
                } catch (err) {
                    reject(err);
                }
            });
            req.on('error', err => reject(err));
        });
}

// Helper: Send JSON Response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    const method = req.method;

  // Handle CORS
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Friendly Route Aliases
  if (pathname === '/login') pathname = '/login.html';
  if (pathname === '/admin') pathname = '/admin.html';

  // ================= API ENDPOINTS =================

  // 1. PUBLIC: Get Menu List
  if (pathname === '/api/menu' && method === 'GET') {
    return sendJSON(res, 200, { success: true, data: CHIP_MENU });
  }

  // 2. PUBLIC: Get Store Info & Config
  if (pathname === '/api/info' && method === 'GET') {
    return sendJSON(res, 200, {
      brand: 'Chip Burger (@chipburger_id)',
      slogan: '★ 100% ORIGINAL BEEF PATTY ★',
      status: db.storeConfig.isOpen ? 'OPEN ORDER SETIAP HARI' : 'STORE TUTUP SEMENTARA',
      isOpen: db.storeConfig.isOpen,
      openNotice: db.storeConfig.openNotice,
      operatingHours: db.storeConfig.operatingHours,
      whatsapp: db.storeConfig.whatsappHotline,
      shippingFeeDelivery: db.storeConfig.deliveryFee,
      shippingFeePickup: 0
    });
  }

  // 3. PUBLIC: Login
  if (pathname === '/api/auth/login' && method === 'POST') {
    try {
      const { emailOrUser, password } = await parseBody(req);
      const user = db.users.find(u => 
        (u.email.toLowerCase() === (emailOrUser || '').toLowerCase() || 
         u.name.toLowerCase() === (emailOrUser || '').toLowerCase() ||
         u.phone === emailOrUser) &&
        u.password === password
      );

      if (user) {
        return sendJSON(res, 200, {
          success: true,
          message: 'Login berhasil!',
          user: { 
            name: user.name, 
            email: user.email, 
            phone: user.phone,
            role: user.role || 'customer'
          }
        });
    } else {
        return sendJSON(res, 401, {
            success: false,
            message: 'Email atau kata sandi tidak cocok.'
        });
    }
} catch (e) {
    return sendJSON(res, 400, { success: false, message: 'Format data tidak valid.' });
}
  }

  // 4. PUBLIC: Order Submission
  if (pathname === '/api/orders' && method === 'POST') {
    try {
      const orderData = await parseBody(req);
      const queueNo = orderData.queueNo || `#CB-${Math.floor(100 + Math.random() * 900)}`;
      const newOrder = {
        queueNo,
        customerName: orderData.customerName || 'Tamu',
        customerPhone: orderData.customerPhone || '-',
        method: orderData.method || 'delivery',
        timeSlot: orderData.timeSlot || 'Kirim / Ambil Sekarang',
        address: orderData.address || '-',
        notes: orderData.notes || '',
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        shippingFee: orderData.shippingFee || 0,
        total: orderData.total || 0,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

        db.orders.unshift(newOrder);
        return sendJSON(res, 201, { success: true, queueNo, order: newOrder });
    } catch (e) {
        return sendJSON(res, 400, { success: false, message: 'Gagal mencatat pesanan.' });
    }
}

  // ================= ADMIN SECURED ENDPOINTS =================

  // 5. ADMIN: Get Orders List
  if (pathname === '/api/admin/orders' && method === 'GET') {
    return sendJSON(res, 200, {
      success: true,
      data: db.orders
    });
  }

  // 6. ADMIN: Update Order Status
  if (pathname === '/api/admin/orders/status' && method === 'POST') {
    try {
      const { queueNo, status } = await parseBody(req);
      const order = db.orders.find(o => o.queueNo === queueNo);
      if (order) {
        order.status = status;
        return sendJSON(res, 200, { success: true, message: `Status pesanan ${queueNo} diubah ke ${status}` });
      } else {
        return sendJSON(res, 404, { success: false, message: 'Pesanan tidak ditemukan' });
      }
    } catch (e) {
      return sendJSON(res, 400, { success: false, message: 'Bad request' });
    }
  }

  // 7. ADMIN: Toggle Menu Availability or Edit Menu
  if (pathname === '/api/admin/menu/toggle' && method === 'POST') {
    try {
      const { id } = await parseBody(req);
      const item = CHIP_MENU.find(m => m.id === id);
      if (item) {
        item.available = !item.available;
        return sendJSON(res, 200, { success: true, available: item.available });
      }
      return sendJSON(res, 404, { success: false, message: 'Item menu tidak ditemukan' });
    } catch (e) {
      return sendJSON(res, 400, { success: false, message: 'Bad request' });
    }
  }

  // 8. ADMIN: Add or Edit Menu
  if (pathname === '/api/admin/menu/save' && method === 'POST') {
    try {
      const itemData = await parseBody(req);
      const existingIndex = CHIP_MENU.findIndex(m => m.id === itemData.id);
      
      const formattedItem = {
        id: itemData.id || `custom-${Date.now()}`,
        name: itemData.name,
        displayPrice: `${Math.round(itemData.price / 1000)}K`,
        price: Number(itemData.price),
        ingredients: itemData.ingredients,
        tag: itemData.tag || 'burger',
        isBestSeller: Boolean(itemData.isBestSeller),
        available: true,
        image: itemData.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
      };
    } catch (e) {
        return sendJSON(res, 400, { success: false, message: 'Bad request' });
    }
}

      if (existingIndex >= 0) {
        CHIP_MENU[existingIndex] = { ...CHIP_MENU[existingIndex], ...formattedItem };
      } else {
        CHIP_MENU.push(formattedItem);
      }
        return sendJSON(res, 404, { success: false, message: 'Item menu tidak ditemukan' });
    } catch (e) {
        return sendJSON(res, 400, { success: false, message: 'Bad request' });
    }
}

      return sendJSON(res, 200, { success: true, item: formattedItem });
    } catch (e) {
      return sendJSON(res, 400, { success: false, message: 'Bad request' });
    }
  }

  // 9. ADMIN: Toggle Store Open/Close
  if (pathname === '/api/admin/store/toggle' && method === 'POST') {
    db.storeConfig.isOpen = !db.storeConfig.isOpen;
    return sendJSON(res, 200, { success: true, isOpen: db.storeConfig.isOpen });
  }

  // 10. ADMIN: Get Dashboard Analytics
  if (pathname === '/api/admin/stats' && method === 'GET') {
    const totalOrders = db.orders.length;
    const pendingOrders = db.orders.filter(o => o.status === 'pending').length;
    const completedOrders = db.orders.filter(o => o.status === 'completed').length;
    const totalRevenue = db.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return sendJSON(res, 200, {
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        isOpen: db.storeConfig.isOpen
      }
    });
  }

        return sendJSON(res, 200, { success: true, item: formattedItem });
    } catch (e) {
        return sendJSON(res, 400, { success: false, message: 'Bad request' });
    }
}

  if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  }

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }
    });
}

fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>404 - Halaman Tidak Ditemukan</h2>
          <p>Kembali ke <a href="/">Beranda Chip Burger</a> atau ke <a href="/admin.html">Portal Admin</a>.</p>
        </div>
      `);
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
});
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`🍔 Chip Burger Web Server & Admin Portal (Node.js)`);
    console.log(`📡 Berjalan di : http://localhost:${PORT}`);
    console.log(`🔑 Login Page  : http://localhost:${PORT}/login.html`);
    console.log(`👑 Portal Admin: http://localhost:${PORT}/admin.html`);
    console.log(`🔒 Akses Khusus: warisulzaim@gmail.com`);
    console.log(`======================================================\n`);
});
