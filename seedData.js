import userModel from "./models/userModel.js";
import proModel from "./models/proModel.js";
import bcrypt from "bcryptjs";

// Sample user data
const sampleUser = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@modernstore.com",
  password: "admin123456"
};

// Sample products data using existing images
const sampleProducts = [
  {
    name: "Premium Fashion Jacket",
    category: "Fashion",
    price: 299,
    still: 15,
    rating: 4.8,
    discount: 10,
    featured: true,
    image: "",
    description: "High-quality fashion jacket for modern style"
  },
  {
    name: "Electronic Device",
    category: "Electronics",
    price: 599,
    still: 8,
    rating: 4.9,
    discount: 15,
    featured: true,
    image: "d3c57bbec2464ece36e9070734714d5f.jpg",
    description: "Latest electronic device with advanced features"
  },
  {
    name: "Home Decor Item",
    category: "Home & Garden",
    price: 149,
    still: 25,
    rating: 4.5,
    discount: 5,
    featured: false,
    image: "homer.jpg",
    description: "Beautiful home decoration piece"
  },
  {
    name: "Kitchen Essential",
    category: "Home & Garden",
    price: 89,
    still: 30,
    rating: 4.3,
    discount: 0,
    featured: false,
    image: "kldon.jpg",
    description: "Essential kitchen tool for daily use"
  },
  {
    name: "Lifestyle Product",
    category: "Lifestyle",
    price: 199,
    still: 12,
    rating: 4.6,
    discount: 20,
    featured: true,
    image: "sdil.jpg",
    description: "Premium lifestyle product for better living"
  },
  {
    name: "Premium Quality Item",
    category: "Fashion",
    price: 399,
    still: 6,
    rating: 5.0,
    discount: 25,
    featured: true,
    image: "Premium Quality.png",
    description: "Top-tier premium quality product"
  }
];

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if MongoDB is connected
    if (!proModel.db || proModel.db.readyState !== 1) {
      console.log("⚠️ Database not connected, skipping seeding");
      return;
    }

    // Check if admin user already exists
    const existingUser = await userModel.findOne({ email: sampleUser.email });

    if (!existingUser) {
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(sampleUser.password, salt);

      const adminUser = new userModel({
        firstName: sampleUser.firstName,
        lastName: sampleUser.lastName,
        email: sampleUser.email,
        password: hashedPassword,
        passwordConfirm: hashedPassword
      });

      await adminUser.save();
      console.log("✅ Admin user created: admin@modernstore.com / admin123456");
    } else {
      console.log("👤 Admin user already exists");
    }

    // Check if products already exist
    const existingProducts = await proModel.find();

    if (existingProducts.length === 0) {
      // Add sample products
      for (const product of sampleProducts) {
        const newProduct = new proModel(product);
        await newProduct.save();
        console.log(`✅ Product added: ${product.name}`);
      }
      console.log("🛍️ All sample products added successfully");
    } else {
      console.log("📦 Products already exist in database");
    }

    console.log("🎉 Database seeding completed!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    console.log("⚠️ Continuing without seeding...");
  }
};