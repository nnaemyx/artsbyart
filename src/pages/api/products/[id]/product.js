import connectDb from "@/lib/connectDB";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  const { id } = req.query;

  await connectDb();

  if (req.method === "GET") {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Error fetching product" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Error deleting product" });
    }
  } else if (req.method === "PUT") {
    const { newProduct } = req.body;
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, newProduct, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ success: true, message: "Product updated successfully", updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Error updating product" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
