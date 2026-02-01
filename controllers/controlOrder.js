import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Place order
export const placeOrder = async (req, res) => {
  try {
    const { userId } = req.body; // comes from middleware
    const { items, total } = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    if (!total || total <= 0) {
      return res.json({ success: false, message: "Invalid total amount" });
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Create order
    const newOrder = new orderModel({
      userId,
      items: items.map((item) => ({
        productId: item._id || item.productId,
        name: item.name || item.title,
        price: item.price,
        image: item.image,
        quantity: item.amount || item.quantity,
        discount: item.discount || 0,
      })),
      total,
      status: "pending",
    });

    const savedOrder = await newOrder.save();

    // Clear user's cart after placing order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error occurred" });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body; // comes from middleware

    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price image");

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error occurred" });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const { userId } = req.body; // comes from middleware
    const { orderId } = req.params;

    const order = await orderModel
      .findOne({ _id: orderId, userId })
      .populate("items.productId", "name price image category");

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error occurred" });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName email")
      .populate("items.productId", "name price image");

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error occurred" });
  }
};

