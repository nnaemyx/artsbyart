// pages/api/wishlist.js

import connectDB from "@/lib/connectDB";
import Wishlist from "@/models/Wishlist";

export default async function handler(req, res) {
  await connectDB();

  const { method, body, query } = req;
  const { productId } = body;

  switch (method) {
    case "GET":
      try {
        const wishlist = await Wishlist.findOne().populate("products");
        res.status(200).json({ success: true, data: wishlist });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        let wishlist = await Wishlist.findOne();

        if (!wishlist) {
          wishlist = new Wishlist({ products: [] });
        }

        if (!wishlist.products.includes(productId)) {
          wishlist.products.push(productId);
          await wishlist.save();
        }

        res.status(200).json({ success: true, data: wishlist });
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      const { productId: deleteId } = query;

      try {
        let wishlist = await Wishlist.findOne();

        if (!wishlist) {
          return res.status(400).json({ success: false, message: "Wishlist not found" });
        }

        wishlist.products = wishlist.products.filter((id) => id.toString() !== deleteId);
        await wishlist.save();

        res.status(200).json({ success: true, data: wishlist });
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Invalid method" });
      break;
  }
}
