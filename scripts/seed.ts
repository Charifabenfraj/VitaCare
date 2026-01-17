import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parapharmacie';

// Seed data
const categories = [
  {
    name: 'Soins Visage',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    slug: 'soins-visage',
  },
  {
    name: 'Soins Corps',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    slug: 'soins-corps',
  },
  {
    name: 'Hygiène',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    slug: 'hygiene',
  },
  {
    name: 'Solaires',
    image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    slug: 'solaires',
  },
  {
    name: 'Cheveux',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    slug: 'cheveux',
  },
  {
    name: 'Compléments Alimentaires',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    slug: 'complements-alimentaires',
  },
];

const productsData = [
  // Soins Visage
  {
    name: 'Crème Hydratante Jour',
    description: 'Crème hydratante légère pour une peau douce et éclatante toute la journée.',
    composition: 'Aqua, Glycerin, Aloe Vera Extract, Vitamin E, Hyaluronic Acid',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 0,
    isPromotion: true,
    promotionPercentage: 20,
    isPack: false,
    stock: 50,
  },
  {
    name: 'Sérum Anti-Âge Vitamine C',
    description: 'Sérum concentré en vitamine C pour réduire les signes du vieillissement.',
    composition: 'Vitamin C 15%, Hyaluronic Acid, Ferulic Acid, Vitamin E',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 0,
    isPromotion: false,
    promotionPercentage: 0,
    isPack: false,
    stock: 35,
  },
  {
    name: 'Masque Purifiant Argile',
    description: 'Masque à l\'argile verte pour purifier et détoxifier la peau.',
    composition: 'Kaolin, Bentonite, Green Clay, Tea Tree Oil, Zinc',
    price: 18.50,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 0,
    isPromotion: true,
    promotionPercentage: 15,
    isPack: false,
    stock: 80,
  },
  // Soins Corps
  {
    name: 'Lait Corps Nourrissant',
    description: 'Lait corporel ultra-nourrissant pour une peau soyeuse et parfumée.',
    composition: 'Shea Butter, Coconut Oil, Vitamin E, Almond Oil',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 1,
    isPromotion: false,
    promotionPercentage: 0,
    isPack: false,
    stock: 60,
  },
  {
    name: 'Huile Sèche Multi-Usages',
    description: 'Huile sèche pour le corps, les cheveux et le visage.',
    composition: 'Argan Oil, Jojoba Oil, Sweet Almond Oil, Vitamin E',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 1,
    isPromotion: true,
    promotionPercentage: 25,
    isPack: false,
    stock: 45,
  },
  {
    name: 'Gommage Corps Sucre',
    description: 'Gommage au sucre pour une exfoliation douce et efficace.',
    composition: 'Sugar, Coconut Oil, Honey, Vitamin E, Essential Oils',
    price: 16.50,
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 1,
    isPromotion: false,
    promotionPercentage: 0,
    isPack: false,
    stock: 70,
  },
  // Hygiène
  {
    name: 'Gel Douche Naturel',
    description: 'Gel douche doux à base d\'ingrédients naturels.',
    composition: 'Aqua, Aloe Vera, Coconut Extract, Lavender Oil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 2,
    isPromotion: false,
    promotionPercentage: 0,
    isPack: false,
    stock: 100,
  },
  {
    name: 'Déodorant Pierre d\'Alun',
    description: 'Déodorant naturel à la pierre d\'alun, 24h de protection.',
    composition: 'Potassium Alum, Aqua',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1585652757141-8837d676054c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 2,
    isPromotion: true,
    promotionPercentage: 10,
    isPack: false,
    stock: 120,
  },
  // Solaires
  {
    name: 'Crème Solaire SPF 50+',
    description: 'Protection solaire très haute pour le visage et le corps.',
    composition: 'Titanium Dioxide, Zinc Oxide, Vitamin E, Aloe Vera',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1556227834-09f1de7a7d14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 3,
    isPromotion: true,
    promotionPercentage: 30,
    isPack: false,
    stock: 40,
  },
  {
    name: 'Après-Soleil Apaisant',
    description: 'Soin après-soleil hydratant et apaisant.',
    composition: 'Aloe Vera, Chamomile, Vitamin E, Allantoin',
    price: 17.50,
    image: 'https://images.unsplash.com/photo-1594125311687-3b1b3eefa9f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 3,
    isPromotion: false,
    promotionPercentage: 0,
    isPack: false,
    stock: 55,
  },
  // Cheveux
  {
    name: 'Shampoing Réparateur',
    description: 'Shampoing réparateur pour cheveux abîmés et cassants.',
    composition: 'Keratin, Argan Oil, Wheat Protein, Vitamin B5',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 4,
    isPromotion: false,
    promotionPercentage: 0,
    isPack: false,
    stock: 85,
  },
  {
    name: 'Masque Capillaire Intense',
    description: 'Masque nourrissant intense pour cheveux secs.',
    composition: 'Shea Butter, Coconut Oil, Keratin, Silk Proteins',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 4,
    isPromotion: true,
    promotionPercentage: 20,
    isPack: false,
    stock: 65,
  },
  // Compléments
  {
    name: 'Vitamines Multiples',
    description: 'Complexe multivitaminé pour une vitalité quotidienne.',
    composition: 'Vitamins A, B, C, D, E, Iron, Zinc, Magnesium',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 5,
    isPromotion: false,
    promotionPercentage: 0,
    isPack: false,
    stock: 200,
  },
  {
    name: 'Oméga 3 Premium',
    description: 'Capsules d\'oméga 3 de haute qualité pour le cœur et le cerveau.',
    composition: 'Fish Oil, EPA, DHA, Vitamin E',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 5,
    isPromotion: true,
    promotionPercentage: 15,
    isPack: false,
    stock: 150,
  },
  // Packs
  {
    name: 'Pack Routine Visage Complète',
    description: 'Kit complet pour une routine visage: nettoyant, sérum et crème hydratante.',
    composition: 'Nettoyant 150ml + Sérum 30ml + Crème 50ml',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 0,
    isPromotion: true,
    promotionPercentage: 25,
    isPack: true,
    stock: 30,
  },
  {
    name: 'Pack Solaire Famille',
    description: 'Ensemble de protection solaire pour toute la famille.',
    composition: 'Crème SPF50 200ml + Spray enfant SPF50 150ml + Après-soleil 200ml',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 3,
    isPromotion: true,
    promotionPercentage: 30,
    isPack: true,
    stock: 25,
  },
  {
    name: 'Pack Cheveux Réparation',
    description: 'Trio réparateur pour cheveux abîmés.',
    composition: 'Shampoing 250ml + Après-shampoing 200ml + Masque 150ml',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 4,
    isPromotion: false,
    promotionPercentage: 0,
    isPack: true,
    stock: 40,
  },
  {
    name: 'Pack Bien-Être Quotidien',
    description: 'Ensemble de compléments alimentaires pour votre bien-être.',
    composition: 'Multivitamines 60 gélules + Oméga 3 60 capsules + Magnésium 60 comprimés',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryIndex: 5,
    isPromotion: true,
    promotionPercentage: 20,
    isPack: true,
    stock: 35,
  },
];

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the collections
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Clear existing data
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert categories
    const insertedCategories = await db.collection('categories').insertMany(categories);
    console.log(`✅ Inserted ${categories.length} categories`);

    // Get category IDs
    const categoryIds = Object.values(insertedCategories.insertedIds);

    // Create products with correct category IDs
    const products = productsData.map((product) => ({
      ...product,
      categoryId: categoryIds[product.categoryIndex],
      categoryIndex: undefined,
    }));

    // Remove categoryIndex from products
    products.forEach((p) => delete (p as { categoryIndex?: number }).categoryIndex);

    // Insert products
    await db.collection('products').insertMany(products);
    console.log(`✅ Inserted ${products.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSummary:');
    console.log(`- ${categories.length} categories`);
    console.log(`- ${products.length} products`);
    console.log(`- ${products.filter(p => p.isPromotion).length} products on promotion`);
    console.log(`- ${products.filter(p => p.isPack).length} packs`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
