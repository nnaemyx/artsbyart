import Procedure from "@/models/procedureModel";
import connectDb from "@/lib/connectDB";
import initMiddleware from "@/utils/init-Middleware";
import Cors from "cors";
import { NextResponse } from "next/server";

const cors = initMiddleware(
  Cors({
    // Set allowed origins based on your requirements
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// const mongoose = require("mongoose");

// const validateMongoDbId = (id) => {
//   const isValid = mongoose.Types.ObjectId.isValid(id);
//   if (!isValid) throw new Error("This id is not valid or not found");
// };

async function handler(req, res) {
  if (req.method === "POST") {
    await cors(req, res);
    try {
      await connectDb();
      const newProcedure = await Procedure.create(req.body);
      res.json(newProcedure);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    try {
      const getAllProcedures = await Procedure.find();
      res.json(getAllProcedures);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error getting procedures" });
    }
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    await connectDb();
    await Procedure.findByIdAndDelete(id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting procedures" });
  }
}

export default handler;
