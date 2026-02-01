import userModel from '../models/userModel.js';

// Add product to cart
const addToCart = async (req, res) => {
  try {
   
    const { userId } = req.body; // comes from middleware
    const { itemId, quantity = 1 } = req.body; // itemId is the product identifier
     
    if (!itemId) {
     return res.json({ success: false, message: "Please send product ID" });
   }
 
     // Find user
     const user = await userModel.findById(userId); // because the userId is the id of the user who is adding the product to the cart
     if (!user) {
       return res.json({ success: false, message: "User not found" });
     }
    
       // Update cartData
     // cartData is an object containing products: { "productId": quantity }
     const cartData = user.cartData || {};
     
     if (cartData[itemId]) {
       // If product already exists, increase quantity
       cartData[itemId] += quantity;
     } else {
       // If new, add it
       cartData[itemId] = quantity;
     }
 
        // Save updates
        await userModel.findByIdAndUpdate(userId, { cartData });
     
        res.json({ success: true, message: "Product added to cart", cartData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error occurred" });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.body; // comes from middleware
    const { itemId } = req.body; // itemId is the product identifier
    
    if (!itemId) {
      return res.json({ success: false, message: "Please send product ID" });
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Update cartData
        const cartData = user.cartData || {};
    
        if (cartData[itemId]) {
          // Remove product from cart
          delete cartData[itemId];
          
          // Save updates
          await userModel.findByIdAndUpdate(userId, { cartData });
          
          res.json({ success: true, message: "Product removed from cart", cartData });
        } else {
          res.json({ success: false, message: "Product not found in cart" });
        }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error occurred" });
  }
};

// Update cart item quantity
const updateCartQuantity = async (req, res) => {
  try {
  const { userId } = req.body; // comes from middleware
  const { itemId, quantity } = req.body;
  
  if (!itemId || quantity === undefined) {
    return res.json({ success: false, message: "Please send product ID and quantity" });
  }

   if (quantity <= 0) {
    // If quantity is 0 or less, remove from cart
    return removeFromCart(req, res);
  }

  // Find user
  const user = await userModel.findById(userId);
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  // Update cartData
  const cartData = user.cartData || {};
  cartData[itemId] = quantity;
  
  // Save updates
  await userModel.findByIdAndUpdate(userId, { cartData });
  
  res.json({ success: true, message: "Cart quantity updated", cartData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error occurred" });
  }
};

// Get cart contents
const getCart = async (req, res) => {
  try {
     const { userId } = req.body; // comes from middleware

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Return cartData
    const cartData = user.cartData || {};
    
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error occurred" });
  }
};

export { addToCart, removeFromCart, getCart, updateCartQuantity };