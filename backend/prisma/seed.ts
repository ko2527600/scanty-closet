import "dotenv/config";
import { prisma } from '../src/lib/prisma.js';

async function main() {
  console.log('🔗 Connection Established!');
  console.log('🔥 Starting Seed...');

  // Reset Data (Cascading deletes handle dependencies)
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 1. Categories
  const catLifestyle = await prisma.category.create({ data: { name: 'Lifestyle' } });
  const catPerformance = await prisma.category.create({ data: { name: 'Performance' } });
  const catBasketball = await prisma.category.create({ data: { name: 'Basketball' } });

  // 2. Products
  const products = [
    {
      name: 'Jordan 1 Retro High OG',
      brand: 'JORDAN',
      description: 'The sneaker that defined a generation. High-cut profile, premium leather, and the legendary "Chicago" colorway.',
      price: 2400,
      categoryId: catLifestyle.id,
      image: '/images/assets/hero.png'
    },
    {
       name: 'Yeezy Boost 350 V2',
       brand: 'ADIDAS',
       description: 'The ultimate fusion of comfort and street style. Features re-engineered Primeknit and signature Boost cushioning.',
       price: 3200,
       categoryId: catLifestyle.id,
       image: '/images/assets/lifestyle.png'
    },
    {
       name: 'KD16 Performance High',
       brand: 'NIKE',
       description: 'Built for the most versatile players. Zoom Air cushioning provides explosive energy return on the hardwood.',
       price: 2100,
       categoryId: catBasketball.id,
       image: '/images/assets/performance.png'
    }
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        brand: p.brand,
        description: p.description,
        price: p.price,
        category_id: p.categoryId,
        variants: {
          create: [
            { size: '9', color: 'Original', sku: `${p.brand.slice(0,2)}-09`, stock_quantity: 10, image_urls: [p.image] },
            { size: '10', color: 'Original', sku: `${p.brand.slice(0,2)}-10`, stock_quantity: 15, image_urls: [p.image] },
            { size: '11', color: 'Original', sku: `${p.brand.slice(0,2)}-11`, stock_quantity: 8, image_urls: [p.image] }
          ]
        }
      }
    });
  }

  console.log('✅ Scanty Closet Seeded with Premium Heat!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
