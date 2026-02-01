import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  category: { type: String, required: true },
  rating: { type: Number, required: true },
  still: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
});

const proModel = mongoose.models.product || mongoose.model("product", productSchema);
export default proModel;
