import connectDb from "@/lib/connectDB";
import Category from "@/models/categoryModel";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  const { id } = req.query;

  await connectDb();

  if (req.method === "GET") {
    try {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Error fetching category" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedCategory = await Category.findByIdAndDelete(id);
      if (!deletedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Error deleting category" });
    }
  } else if (req.method === "PUT") {
    const { newCategory } = req.body;
    try {
      const updatedCategory = await Category.findByIdAndUpdate(id, { title: newCategory }, { new: true });
      if (!updatedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json({ success: true, message: "Category updated successfully", updatedCategory });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Error updating category" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
