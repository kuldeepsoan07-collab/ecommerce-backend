import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      type: String,
      required: [true, "Product image is required"],
    },

    badge: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("products", productSchema);

export default productModel;