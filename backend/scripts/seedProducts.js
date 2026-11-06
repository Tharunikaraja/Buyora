const { supabase, isConfigured } = require('../config/db');

const categoryImageMap = {
  Smartphones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',
  ],
  Laptops: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  ],
  Audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  ],
  Wearables: [
    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  ],
  Cameras: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  ],
  Gaming: [
    'https://images.unsplash.com/photo-1587202372775-98927b6d6d09?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1593305841991-05c297ba4571?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=80',
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1569183127307-1a2d3d0d3a4d?auto=format&fit=crop&w=900&q=80',
  ],
};

const catalogDefinitions = [
  { category: 'Smartphones', brands: ['Samsung', 'Apple', 'OnePlus', 'Redmi', 'Nothing'], basePrice: 22000 },
  { category: 'Laptops', brands: ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer'], basePrice: 40000 },
  { category: 'Audio', brands: ['Sony', 'JBL', 'Boat', 'Bose', 'Noise'], basePrice: 8000 },
  { category: 'Wearables', brands: ['Apple', 'Samsung', 'Garmin', 'Noise', 'Fastrack'], basePrice: 12000 },
  { category: 'Cameras', brands: ['Canon', 'Sony', 'Nikon', 'GoPro', 'Fujifilm'], basePrice: 32000 },
  { category: 'Gaming', brands: ['MSI', 'Asus', 'Lenovo', 'Sony', 'Acer'], basePrice: 55000 },
  { category: 'Accessories', brands: ['Anker', 'Logitech', 'Belkin', 'Ugreen', 'Zebronics'], basePrice: 3000 },
];

const modelFamilies = {
  Smartphones: ['Galaxy', 'Astra', 'Nova', 'Pulse', 'Vertex', 'Nexa', 'Zenith'],
  Laptops: ['Vantage', 'Orbit', 'NexaBook', 'Sprint', 'Flex', 'Elite', 'Core'],
  Audio: ['Sound', 'Audio', 'Pulse', 'Echo', 'Breeze', 'Waves'],
  Wearables: ['Watch', 'Band', 'Sense', 'Pulse', 'Track'],
  Cameras: ['Lens', 'Capture', 'Flash', 'Prime', 'Vision'],
  Gaming: ['Rogue', 'Titan', 'Legend', 'Forge', 'Shadow'],
  Accessories: ['Dock', 'Hub', 'Link', 'Drive', 'Charge'],
};

const getCategoryImages = (category, index) => {
  const pool = categoryImageMap[category] || categoryImageMap.Smartphones;
  return [pool[index % pool.length]];
};

const createProductRows = (count = 1000) => {
  const rows = [];

  for (let index = 0; index < count; index += 1) {
    const categoryDefinition = catalogDefinitions[index % catalogDefinitions.length];
    const category = categoryDefinition.category;
    const brand = categoryDefinition.brands[index % categoryDefinition.brands.length];
    const family = modelFamilies[category][index % modelFamilies[category].length];
    const price = categoryDefinition.basePrice + ((index * 1273) % 60000);
    const discountPrice = Math.max(999, Math.round(price * (0.82 + ((index % 10) * 0.017))));
    const stock = 5 + ((index * 11) % 120);
    const rating = Number((3.6 + ((index * 7) % 14) / 10).toFixed(1));

    rows.push({
      product_id: `TECH${String(index + 1).padStart(4, '0')}`,
      name: `${brand} ${family} ${index + 1}`,
      brand,
      category,
      description: `Premium ${category.toLowerCase()} device designed for everyday performance, style, and durability.`,
      price: Number(price),
      discount_price: Number(discountPrice),
      images: getCategoryImages(category, index),
      specifications: {
        display: `${(5.2 + (index % 7) * 0.7).toFixed(1)}-inch display`,
        storage: `${128 + (index % 5) * 128}GB`,
        batteryHours: 8 + (index % 18),
        ram: `${4 + (index % 5) * 4}GB`,
        connectivity: 'Wi-Fi 6 / 5G',
        camera: `${12 + (index % 5) * 6}MP camera`,
      },
      stock,
      delivery_days: 2 + (index % 6),
      rating,
      reviews: 100 + ((index * 29) % 6500),
      featured: index % 5 === 0,
      best_seller: index % 3 === 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  return rows;
};

const seedProducts = async (count = 1000) => {
  if (!isConfigured || !supabase) {
    console.log('Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to seed products into the database.');
    return;
  }

  const safeCount = Number.isFinite(Number(count)) ? Math.max(1, Number(count)) : 1000;
  const rows = createProductRows(safeCount);

  const { error: deleteError } = await supabase.from('products').delete().neq('product_id', '');
  if (deleteError) {
    console.error('Failed to clear old products:', deleteError.message);
    process.exitCode = 1;
    return;
  }

  const { error } = await supabase.from('products').insert(rows);

  if (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`Deleted old products and inserted ${rows.length} matching-category products into Supabase.`);
};

if (require.main === module) {
  const targetCount = Number(process.argv[2] || 1000);
  seedProducts(targetCount);
}

module.exports = { seedProducts, createProductRows };
