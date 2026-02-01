import mongoose from "mongoose";

export const connectDb = async () => {
   try {
      // Get MongoDB URI from environment variables
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

      if (!mongoUri) {
         console.log("⚠️ No MongoDB URI found in environment variables");
         console.log("🔧 Using fallback connection string");
         // Fallback connection string
         const fallbackUri = "mongodb+srv://moshaheen616_db_user:123456@cluster0.xhgf2xx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";
         await connectWithUri(fallbackUri);
         return;
      }

      await connectWithUri(mongoUri);
   } catch (error) {
      console.error("❌ Database connection failed:", error.message);
      console.log("⚠️ Server will continue running with temporary storage");
   }
};

const connectWithUri = async (uri) => {
   console.log("🔄 Attempting to connect to MongoDB...");
   console.log("📍 Connection URI:", uri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

   // Modern connection options
   const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
   };

   await mongoose.connect(uri, options);

   if (uri.includes('localhost')) {
      console.log("✅ Database Connected Successfully to Local MongoDB");
   } else {
      console.log("✅ Database Connected Successfully to MongoDB Atlas");
   }
};