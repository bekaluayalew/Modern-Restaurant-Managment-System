const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Sample Products
const sampleProducts = [
  // {
  //   name: 'Classic Espresso',
  //   description: 'Rich and bold single-shot espresso with a creamy crema. Perfect for coffee purists.',
  //   price: 3.50,
  //   category: 'Coffee',
  //   stock: 50,
  //   image: 'espresso.jpg',
  //   rating: 4.8,
  //   reviews: 45
  // },
  {
    name: 'Cappuccino',
    description: 'Perfectly balanced espresso with steamed milk and a generous layer of foam.',
    price: 4.00,
    category: 'Coffee',
    stock: 40,
    image: 'cappuccino.jpg',
    rating: 4.9,
    reviews: 78
  },
  // {
  //   name: 'Latte',
  //   description: 'Smooth espresso with steamed milk and a light layer of foam. Creamy and comforting.',
  //   price: 4.25,
  //   category: 'Coffee',
  //   stock: 35,
  //   image: 'latte.jpg',
  //   rating: 4.7,
  //   reviews: 62
  // },
  // {
  //   name: 'Mocha',
  //   description: 'Indulgent chocolate and espresso blend with whipped cream and chocolate drizzle.',
  //   price: 4.50,
  //   category: 'Coffee',
  //   stock: 30,
  //   image: 'mocha.jpg',
  //   rating: 4.9,
  //   reviews: 55
  // },
  {
    name: 'Americano',
    description: 'Espresso diluted with hot water for a smooth, full-bodied coffee experience.',
    price: 3.25,
    category: 'Coffee',
    stock: 45,
    image: 'americano.jpg',
    rating: 4.5,
    reviews: 38
  },
  {
    name: 'Green Tea',
    description: 'Fresh and refreshing green tea with antioxidants. Calming and rejuvenating.',
    price: 3.00,
    category: 'Tea',
    stock: 40,
    image: 'greentea.jpg',
    rating: 4.6,
    reviews: 42
  },
  // {
  //   name: 'Chai Latte',
  //   description: 'Spiced tea with steamed milk and a touch of honey. Warming and aromatic.',
  //   price: 4.25,
  //   category: 'Tea',
  //   stock: 25,
  //   image: 'chai.jpg',
  //   rating: 4.8,
  //   reviews: 33
  // },
  {
    name: 'Butter Croissant',
    description: 'Buttery, flaky pastry baked to golden perfection. A classic French delight.',
    price: 2.50,
    category: 'Pastry',
    stock: 30,
    image: 'croissant.jpg',
    rating: 4.9,
    reviews: 89
  },
  // {
  //   name: 'Blueberry Muffin',
  //   description: 'Freshly baked muffin bursting with blueberries and topped with streusel.',
  //   price: 3.00,
  //   category: 'Pastry',
  //   stock: 20,
  //   image: 'muffin.jpg',
  //   rating: 4.7,
  //   reviews: 56
  // },
  {
    name: 'Club Sandwich',
    description: 'Triple-decker sandwich with grilled chicken, bacon, lettuce, and tomato.',
    price: 6.50,
    category: 'Sandwich',
    stock: 15,
    image: 'sandwich.jpg',
    rating: 4.6,
    reviews: 41
  },
  {
    name: 'Fresh Orange Juice',
    description: 'Squeezed from fresh oranges, packed with vitamin C. Naturally refreshing.',
    price: 3.75,
    category: 'Beverage',
    stock: 25,
    image: 'orangejuice.jpg',
    rating: 4.8,
    reviews: 34
  },
  // {
  //   name: 'Berry Smoothie Bowl',
  //   description: 'Blended fruit smoothie topped with granola, fresh berries, and coconut flakes.',
  //   price: 5.50,
  //   category: 'Beverage',
  //   stock: 10,
  //   image: 'smoothiebowl.jpg',
  //   rating: 4.9,
  //   reviews: 47
  // },
  {
    name: 'Cheese Burger',
    description: 'Juicy grilled beef patty topped with melted cheddar cheese, crisp lettuce, fresh tomato, onions, and our signature burger sauce.',
    price: 10.00,
    category: 'Burger',
    stock: 15,
    image: 'cheeseburger.jpg',
    rating: 4.9,
    reviews: 50
  },
  {
    name: 'Chicken Burger',
    description: 'Tender grilled chicken breast served with fresh lettuce, tomato, creamy mayonnaise, and melted cheese in a toasted bun.',
    price: 11.00,
    category: 'Burger',
    stock: 15,
    image: 'chickenburger.jpg',
    rating: 4.5,
    reviews: 44
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Crispy hand-tossed crust topped with rich tomato sauce, mozzarella cheese, and premium pepperoni slices baked to perfection.',

    price: 15.00,
    category: 'Pizza',
    stock: 15,
    image: 'pepperoni.jpg',
    rating: 4.5,
    reviews: 44
  },
   {
    name: 'Veggie Pizza',
    description: 'Loaded with fresh bell peppers, onions, mushrooms, olives, tomatoes, and mozzarella cheese on a crispy golden crust.',
    price: 14.00,
    category: 'Pizza',
    stock: 15,
    image: 'veggie.jpg',
    rating: 4.5,
    reviews: 44
  },
   {
    name: 'Beef Pasta',
    description: 'Tender beef strips tossed with perfectly cooked pasta in a rich tomato sauce, seasoned with herbs and topped with Parmesan cheese.',
    price: 12.00,
    category: 'Pasta',
    stock: 5,
    image: 'beefpasta.jpg',
    rating: 4.5,
    reviews: 44
  },
   {
    name: 'White Sauce Pasta',
    description: 'Blended fruit smoothie topped with granola, fresh berries, and coconut flakes.',
    price: 13.00,
    category: 'Pasta',
    stock: 12,
    image: 'whitesauce.jpg',
    rating: 4.5,
    reviews: 44
  },
  {
    name: 'Iced Coffee',
    description: 'Smooth espresso served over ice with chilled milk and a touch of sweetness for a refreshing coffee experience.',
    price: 5.00,
    category: 'Coffee',
    stock: 20,
    image: 'icedcoffee.jpg',
    rating: 4.8,
    reviews: 45
  },
   {
    name: 'Lemonade',
    description:'Freshly squeezed lemons blended with cold water and a hint of sweetness, served over ice for a crisp and refreshing drink.',
    price: 4.00,
    category: 'Beverage',
    stock: 20,
    image: 'lemonade.jpg',
    rating: 4.4,
    reviews: 48
  },
  {
    name:'kitefo' ,
    description: 'reshly squeezed lemons blended with cold water ' ,
    price: 1980,
    category: 'foods' ,
    stock: 50,
    image: 'kitefo.jpg' ,
    rating: 4.4,
    reviews: 100  
    }
];

// Sample Users
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@mrms.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'bereket',
    email: 'beki@gmail.com',
    password: 'beki123',
    role: 'customer'
  },
  {
    username: 'bekalu',
    email: 'bekalu@gmail.com',
    password: 'bekalu@123',
    role: 'admin'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🔄 Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert products
    console.log('🔄 Inserting products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} products`);

    // Hash passwords and insert users
    console.log('🔄 Inserting users...');
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );
    const users = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Inserted ${users.length} users`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Database Summary:');
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Users: ${users.length}`);
    
    console.log('\n👤 Login Credentials:');
    console.log('   Admin:');
    console.log('   Email: admin@mrms.com');
    console.log('   Password: admin123');
    console.log('   Admin #2:');
    console.log('   Email: bekalu@gmail.com');
    console.log('   Password: bekalu@123');
    console.log('   Customer:');
    console.log('   Email: beki@gmail.com');
    console.log('   Password: beki123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();