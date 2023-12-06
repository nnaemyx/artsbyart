// pages/api/products/[slug].js

import connectDb from "@/lib/connectDB";
import Product from "@/models/productModel";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { slug } = req.query;

    try {
      await connectDb();
      const product = await Product.findOne({ slug });
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching product details" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
