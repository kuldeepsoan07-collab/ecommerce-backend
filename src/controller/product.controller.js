import productModel from "../models/product.model.js";

// Create Product
export async function createProduct(req, res) {
  try {
    const product = await productModel.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
}

// Get All Products
export async function getProducts(req, res) {
  try {
    const products = await productModel.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
}

// Get Single Product
export async function getProductById(req, res) {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
}

// Update Product
export async function updateProduct(req, res) {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
}

// Delete Product
export async function deleteProduct(req, res) {
  try {
    const product = await productModel.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
}