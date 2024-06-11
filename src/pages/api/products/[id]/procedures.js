import connectDb from "@/lib/connectDB";
import Procedure from "@/models/procedureModel";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  const { id } = req.query;

  await connectDb();

  if (req.method === "GET") {
    try {
      const procedure = await Procedure.findById(id);
      if (!procedure) {
        return res.status(404).json({ error: "Procedure not found" });
      }
      res.status(200).json(procedure);
    } catch (error) {
      console.error("Error fetching procedure :", error);
      res.status(500).json({ error: "Error fetching procedure" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedProcedure = await Procedure.findByIdAndDelete(id);
      if (!deletedProcedure) {
        return res.status(404).json({ error: "Procedure not found" });
      }
      res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting procedure:", error);
      res.status(500).json({ error: "Error deleting procedure" });
    }
  } else if (req.method === "PUT") {
    const { newProcedure } = req.body;
    try {
      const updatedProcedure = await Procedure.findByIdAndUpdate(id, { description: newProcedure }, { new: true });
      if (!updatedProcedure) {
        return res.status(404).json({ error: "Procedure not found" });
      }
      res.status(200).json({ success: true, message: "Category updated successfully", updatedProcedure });
    } catch (error) {
      console.error("Error updating procedure:", error);
      res.status(500).json({ error: "Error updating procedure" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
