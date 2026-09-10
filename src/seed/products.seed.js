import mongoose from "mongoose";
import config from "../config/config.js";
import productModel from "../models/product.model.js";

const products = [
  {
    name: "Premium Classic Watch",
    description:
      "A stylish classic watch with a premium design, suitable for everyday and formal wear.",
    brand: "TimePro",
    category: "watches",
    price: 149,
    originalPrice: 199,
    discount: 25,
    stock: 25,
    rating: 4.5,
    reviews: 120,
    image: "https://picsum.photos/seed/watch/600/700",
    badge: "Sale",
  },

  {
    name: "Wireless Headphones",
    description:
      "Comfortable wireless headphones with clear sound and a powerful battery for everyday listening.",
    brand: "SoundMax",
    category: "headphones",
    price: 89,
    originalPrice: 119,
    discount: 25,
    stock: 40,
    rating: 4.7,
    reviews: 230,
    image: "https://picsum.photos/seed/headphones/600/700",
    badge: "Popular",
  },

  {
    name: "Premium Laptop",
    description:
      "A powerful laptop designed for work, study, entertainment and everyday productivity.",
    brand: "TechBook",
    category: "laptops",
    price: 799,
    originalPrice: 999,
    discount: 20,
    stock: 15,
    rating: 4.8,
    reviews: 185,
    image: "https://picsum.photos/seed/laptop/600/700",
    badge: "Sale",
  },

  {
    name: "Modern Backpack",
    description:
      "Modern and durable backpack with enough space for daily essentials, books and accessories.",
    brand: "UrbanCarry",
    category: "bags",
    price: 69,
    originalPrice: 89,
    discount: 22,
    stock: 35,
    rating: 4.4,
    reviews: 95,
    image: "https://picsum.photos/seed/bag/600/700",
    badge: "New",
  },

  {
    name: "Smartphone Pro",
    description:
      "A modern smartphone with a premium display, powerful performance and advanced features.",
    brand: "SmartTech",
    category: "electronics",
    price: 599,
    originalPrice: 699,
    discount: 14,
    stock: 20,
    rating: 4.6,
    reviews: 310,
    image: "https://picsum.photos/seed/phone/600/700",
    badge: "Popular",
  },

  {
    name: "Premium Casual Shirt",
    description:
      "Comfortable premium casual shirt made for everyday wear with a modern fit.",
    brand: "UrbanStyle",
    category: "fashion",
    price: 49,
    originalPrice: 69,
    discount: 29,
    stock: 50,
    rating: 4.3,
    reviews: 78,
    image: "https://picsum.photos/seed/shirt/600/700",
    badge: "Sale",
  },

  {
    name: "Smart Fitness Watch",
    description:
      "Smart fitness watch for tracking daily activities, workouts and health-related metrics.",
    brand: "FitTech",
    category: "watches",
    price: 129,
    originalPrice: 169,
    discount: 24,
    stock: 30,
    rating: 4.6,
    reviews: 156,
    image: "https://picsum.photos/seed/smartwatch/600/700",
    badge: "New",
  },

  {
    name: "Premium Hoodie",
    description:
      "Soft and comfortable premium hoodie with a modern design for casual everyday wear.",
    brand: "UrbanStyle",
    category: "fashion",
    price: 59,
    originalPrice: 79,
    discount: 25,
    stock: 45,
    rating: 4.5,
    reviews: 92,
    image: "https://picsum.photos/seed/hoodie/600/700",
    badge: "Popular",
  },

  {
    name: "Bluetooth Speaker",
    description:
      "Portable Bluetooth speaker delivering clear audio and powerful sound for indoor and outdoor use.",
    brand: "SoundMax",
    category: "electronics",
    price: 79,
    originalPrice: 109,
    discount: 28,
    stock: 35,
    rating: 4.4,
    reviews: 187,
    image: "https://picsum.photos/seed/speaker/600/700",
    badge: "Sale",
  },

  {
    name: "Gaming Laptop",
    description:
      "High-performance gaming laptop built for gaming, demanding applications and multitasking.",
    brand: "GameTech",
    category: "laptops",
    price: 1199,
    originalPrice: 1399,
    discount: 14,
    stock: 10,
    rating: 4.9,
    reviews: 245,
    image: "https://picsum.photos/seed/gaming-laptop/600/700",
    badge: "Premium",
  },

  {
    name: "Travel Backpack",
    description:
      "Spacious and durable travel backpack designed for trips, work and everyday travel.",
    brand: "TravelPro",
    category: "bags",
    price: 89,
    originalPrice: 119,
    discount: 25,
    stock: 25,
    rating: 4.5,
    reviews: 134,
    image: "https://picsum.photos/seed/travel-bag/600/700",
    badge: "New",
  },

  {
    name: "Home Table Lamp",
    description:
      "Elegant table lamp with a modern design that adds comfortable lighting to your home.",
    brand: "HomeGlow",
    category: "home-living",
    price: 45,
    originalPrice: 59,
    discount: 24,
    stock: 30,
    rating: 4.2,
    reviews: 64,
    image: "https://picsum.photos/seed/lamp/600/700",
    badge: "Sale",
  },

  {
    name: "Premium Earbuds",
    description:
      "Compact wireless earbuds with clear audio, comfortable fit and convenient everyday use.",
    brand: "SoundMax",
    category: "headphones",
    price: 69,
    originalPrice: 99,
    discount: 30,
    stock: 50,
    rating: 4.6,
    reviews: 210,
    image: "https://picsum.photos/seed/earbuds/600/700",
    badge: "Popular",
  },

  {
    name: "Training Dumbbells",
    description:
      "Durable training dumbbells suitable for home workouts, strength training and fitness routines.",
    brand: "FitGear",
    category: "fitness",
    price: 99,
    originalPrice: 129,
    discount: 23,
    stock: 20,
    rating: 4.4,
    reviews: 76,
    image: "https://picsum.photos/seed/fitness/600/700",
    badge: "New",
  },
];


async function seedProducts() {
  try {
    await mongoose.connect(config.MONGO_URI);

    console.log("MongoDB connected");

    // Remove old products
    await productModel.deleteMany({});

    // Insert updated products
    await productModel.insertMany(products);

    console.log(
      `${products.length} products inserted successfully`
    );

    await mongoose.disconnect();

    console.log("MongoDB disconnected");

  } catch (error) {
    console.error("Seed error:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
}


seedProducts();