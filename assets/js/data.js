// Chip Burger Menu Data
const MENU_ITEMS = [
  {
    id: 'cb-01',
    name: 'Chip Monster Cheese Burger',
    category: 'burger',
    price: 48000,
    rating: 4.9,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    description: 'Double beef patty juicy, keju lumer cheddar berlimpah, dan topping artisanal potato chips renyah gurih.',
    spicy: false
  },
  {
    id: 'cb-02',
    name: 'Smoky BBQ Crunch Burger',
    category: 'burger',
    price: 42000,
    rating: 4.8,
    badge: 'Favorit',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    description: 'Daging sapi panggang saus Texas BBQ asap aromatik, caramelized onion, dan keripik kentang renyah.',
    spicy: false
  },
  {
    id: 'cb-03',
    name: 'Spicy Fire Chip Burger',
    category: 'burger',
    price: 45000,
    rating: 4.9,
    badge: 'Pedas Nampol',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
    description: 'Sensasi pedas cabai habanero dan chipotle dipadu dengan spicy chip crunch yang meledak di lidah.',
    spicy: true
  },
  {
    id: 'cb-04',
    name: 'Truffle Mushroom Chip Burger',
    category: 'burger',
    price: 52000,
    rating: 5.0,
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1583032015879-c5622e519967?auto=format&fit=crop&w=600&q=80',
    description: 'Saus jamur champignon aroma minyak truffle asli, swiss cheese, beef patty, serta keripik kentang emas.',
    spicy: false
  },
  {
    id: 'cb-05',
    name: 'Crispy Chicken Honey Mustard',
    category: 'burger',
    price: 38000,
    rating: 4.7,
    badge: 'Ayam Renyah',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
    description: 'Fillet paha ayam krispi tebal dengan saus madu mustard creamy, selada segar, dan potato chips.',
    spicy: false
  },
  {
    id: 'cb-06',
    name: 'Kombo Kenyang Chip Burger',
    category: 'combo',
    price: 59000,
    rating: 4.9,
    badge: 'Hemat 20%',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80',
    description: '1 Chip Monster Cheese + 1 Large French Fries / Chips + 1 Es Cola Dingin Segar.',
    spicy: false
  },
  {
    id: 'cb-07',
    name: 'Kombo Duo Party Crunch',
    category: 'combo',
    price: 99000,
    rating: 4.9,
    badge: 'Paling Laris',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80',
    description: '2 Burger Pilihan (Monster + BBQ) + 1 Keranjang Chips Aneka Saus + 2 Lemon Tea Segar.',
    spicy: false
  },
  {
    id: 'cb-08',
    name: 'Artisanal Golden Chips Basket',
    category: 'sides',
    price: 22000,
    rating: 4.8,
    badge: 'Cemilan Khas',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    description: 'Keripik kentang buatan tangan yang digoreng ekstra renyah dengan taburan rempah bawang gurih.',
    spicy: false
  },
  {
    id: 'cb-09',
    name: 'Loaded Cheese Fries & Chips',
    category: 'sides',
    price: 28000,
    rating: 4.8,
    badge: 'Keju Meleleh',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    description: 'Kombinasi kentang goreng & keripik disiram saus keju cheddar hangat dan taburan daging cincang.',
    spicy: false
  },
  {
    id: 'cb-10',
    name: 'Iced Lemon Mint Tea',
    category: 'drinks',
    price: 15000,
    rating: 4.7,
    badge: 'Segar Alami',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    description: 'Teh lemon dingin dengan daun mint segar asli, manis pas pelepas dahaga setelah makan burger.',
    spicy: false
  },
  {
    id: 'cb-11',
    name: 'Sparkling Orange Punch',
    category: 'drinks',
    price: 18000,
    rating: 4.8,
    badge: 'Soda Buah',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    description: 'Minuman soda sari jeruk segar dingin yang bersoda mantap dan menyegarkan tenggorokan.',
    spicy: false
  },
  {
    id: 'cb-12',
    name: 'Classic Chocolate Milkshake',
    category: 'drinks',
    price: 24000,
    rating: 4.9,
    badge: 'Creamy',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    description: 'Milkshake cokelat kental premium dengan whipped cream manis dan taburan choco chips.',
    spicy: false
  }
];

// Available Promo Codes
const PROMO_CODES = {
  'CRUNCHYCHIP': { discountPercent: 25, label: 'Diskon 25% Pelanggan Baru' },
  'HEMAT10': { discountPercent: 10, label: 'Diskon 10%' },
  'BURGERCHIP': { discountFixed: 15000, label: 'Potongan Rp 15.000' }
};
