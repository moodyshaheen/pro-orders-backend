import proModel from "../models/proModel.js";

// Temporary in-memory storage when DB is not connected
let tempProducts = [];
let tempIdCounter = 1;

// Check if MongoDB is connected
const isDbConnected = () => {
  return proModel.db && proModel.db.readyState === 1;
};

// Add product
export const addPro = async (req, res) => {
  try {
    console.log("📝 Adding product with data:", req.body);
    console.log("📷 Image file:", req.file ? "Present" : "Not provided");

    // Validate required fields
    if (!req.body || !req.body.name) {
      console.error("❌ Missing required field: name");
      return res.status(400).json({
        success: false,
        message: "Missing required field: name"
      });
    }

    let imageData = '';

    // Handle image upload
    if (req.file) {
      try {
        // Convert image to base64 for storage
        const imageBase64 = req.file.buffer.toString('base64');
        const imageMimeType = req.file.mimetype;
        imageData = `data:${imageMimeType};base64,${imageBase64}`;
        console.log("📷 Image converted to base64, size:", imageBase64.length);
      } catch (imageError) {
        console.error("❌ Error processing image:", imageError);
        // Continue without image
      }
    }

    const productData = {
      name: req.body.name.trim(),
      price: Number(req.body.price) || 0,
      image: imageData,
      category: req.body.category || 'General',
      rating: Number(req.body.rating) || 0,
      still: Number(req.body.still) || 0,
      discount: Number(req.body.discount) || 0,
      featured: req.body.featured === 'true' || req.body.featured === true,
      description: req.body.description || '',
      createdAt: new Date()
    };

    console.log("📦 Product data prepared:", {
      ...productData,
      image: productData.image ? `[Base64 image ${productData.image.length} chars]` : 'No image'
    });

    if (isDbConnected()) {
      // Use MongoDB
      const newProduct = new proModel(productData);
      const savedProduct = await newProduct.save();
      console.log("✅ Product saved to MongoDB");
      res.json({ success: true, product: savedProduct, message: "Product added successfully!" });
    } else {
      // Use temporary storage
      const tempProduct = {
        _id: tempIdCounter++,
        ...productData
      };
      tempProducts.push(tempProduct);
      console.log("📦 Product saved to temporary storage (DB not connected)");
      res.json({ success: true, product: tempProduct, message: "Product added successfully!" });
    }
  } catch (err) {
    console.error("❌ Error in addPro:", err);
    res.status(500).json({ success: false, message: "Error adding product: " + err.message });
  }
};

// Update product
export const updatePro = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("📝 Updating product with ID:", productId);
    console.log("📝 Update data:", req.body);
    console.log("📷 New image file:", req.file ? "Present" : "Not provided");

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    let imageData = '';

    // Handle image upload
    if (req.file) {
      try {
        const imageBase64 = req.file.buffer.toString('base64');
        const imageMimeType = req.file.mimetype;
        imageData = `data:${imageMimeType};base64,${imageBase64}`;
        console.log("📷 New image converted to base64");
      } catch (imageError) {
        console.error("❌ Error processing image:", imageError);
      }
    }

    const updateData = {
      name: req.body.name?.trim(),
      price: Number(req.body.price) || 0,
      category: req.body.category || 'General',
      rating: Number(req.body.rating) || 0,
      still: Number(req.body.still) || 0,
      discount: Number(req.body.discount) || 0,
      featured: req.body.featured === 'true' || req.body.featured === true,
      description: req.body.description || '',
      updatedAt: new Date()
    };

    // Only update image if new one is provided
    if (imageData) {
      updateData.image = imageData;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    if (isDbConnected()) {
      // Use MongoDB
      const updatedProduct = await proModel.findByIdAndUpdate(
        productId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      console.log("✅ Product updated in MongoDB");
      res.json({ success: true, product: updatedProduct, message: "Product updated successfully!" });
    } else {
      // Use temporary storage
      const productIndex = tempProducts.findIndex(p => p._id == productId);
      if (productIndex === -1) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      tempProducts[productIndex] = { ...tempProducts[productIndex], ...updateData };
      console.log("✅ Product updated in temporary storage");
      res.json({ success: true, product: tempProducts[productIndex], message: "Product updated successfully!" });
    }
  } catch (err) {
    console.error("❌ Error in updatePro:", err);
    res.status(500).json({ success: false, message: "Error updating product: " + err.message });
  }
};

// List all products
export const listPro = async (req, res) => {
  try {
    if (isDbConnected()) {
      const products = await proModel.find({}).sort({ createdAt: -1 });
      res.json({ success: true, data: products });
    } else {
      // Return temporary products
      console.log("📦 Returning products from temporary storage");
      res.json({ success: true, data: tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
    }
  } catch (error) {
    console.error("❌ Error in listPro:", error);
    res.json({ success: false, message: "Error fetching products: " + error.message });
  }
};

// Remove product
export const removePro = async (req, res) => {
  try {
    const productId = req.body.id;
    console.log("🗑️ Removing product with ID:", productId);

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    if (isDbConnected()) {
      const deletedProduct = await proModel.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      console.log("✅ Product removed from MongoDB");
    } else {
      // Remove from temporary storage
      const index = tempProducts.findIndex(p => p._id == productId);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      tempProducts.splice(index, 1);
      console.log("✅ Product removed from temporary storage");
    }

    res.json({ success: true, message: "Product removed successfully!" });
  } catch (error) {
    console.error("❌ Error removing product:", error);
    res.status(500).json({ success: false, message: "Error removing product: " + error.message });
  }
};

// Get products by IDs
export const getProductsByIds = async (req, res) => {
  try {
    const ids = req.query.id;

    if (!ids) {
      return res.status(400).json({ success: false, message: "Product IDs are required" });
    }

    const idsArray = Array.isArray(ids) ? ids : [ids];

    if (isDbConnected()) {
      const products = await proModel.find({ _id: { $in: idsArray } });
      res.json({ success: true, data: products });
    } else {
      // Filter from temporary storage
      const products = tempProducts.filter(p => idsArray.includes(p._id.toString()));
      res.json({ success: true, data: products });
    }
  } catch (err) {
    console.error("❌ Error in getProductsByIds:", err);
    res.status(500).json({ success: false, message: "Error fetching products: " + err.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("📦 Getting product with ID:", productId);

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    if (isDbConnected()) {
      const product = await proModel.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      res.json({ success: true, data: product });
    } else {
      // Find in temporary storage
      const product = tempProducts.find(p => p._id == productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      res.json({ success: true, data: product });
    }
  } catch (err) {
    console.error("❌ Error in getProductById:", err);
    res.status(500).json({ success: false, message: "Error fetching product: " + err.message });
  }
};