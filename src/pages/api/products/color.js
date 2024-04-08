import Color from "@/models/colorModel";
import connectDb from "@/lib/connectDB";
import initMiddleware from "@/utils/init-Middleware";
import Cors from "cors";

const cors = initMiddleware(
  Cors({
    // Set allowed origins based on your requirements
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const mongoose = require("mongoose");

const validateMongoDbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("This id is not valid or not found");
};

async function handler(req, res) {
  if (req.method === "POST") {
    await cors(req, res);
    try {
        await connectDb();
      const newColor = await Color.create(req.body);
      res.json(newColor);
    } catch (error) {
      throw new Error(error);
    }
  } else if (req.method === "GET") {
    if (req.query.id) {
      // Handle getting a specific color by ID
      const { id } = req.query;
      validateMongoDbId(id);
      try {
        const getaColor = await Color.findById(id);
        res.json(getaColor);
      } catch (error) {
        throw new Error(error);
      }
    } else {
      // Handle getting all colors
      try {
        const getallColor = await Color.find();
        res.json(getallColor);
      } catch (error) {
        console.error(error);
      res.status(500).json({ error: "Error uploading product" });
      }
    }
  } else if (req.method === "PUT") {
    // Handle updating a color
    const { id } = req.query;
    validateMongoDbId(id);
    try {
      await connectDB();
      const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updatedColor);
    } catch (error) {
      throw new Error(error);
    }
  } else if (req.method === "DELETE") {
    // Handle deleting a color
    const { id } = req.query;
    validateMongoDbId(id);
    try {
      await connectDB();
      const deletedColor = await Color.findByIdAndDelete(id);
      res.json(deletedColor);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default handler;