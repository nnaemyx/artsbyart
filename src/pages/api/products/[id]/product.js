import connectDb from "@/lib/connectDB";
import Product from "@/models/productModel";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { NextResponse } from "next/server";
import slugify from "slugify";
import initMiddleware from "@/utils/init-Middleware";
import Cors from "cors";

// Initialize CORS middleware
const cors = initMiddleware(
  Cors({
    origin: ["http://localhost:3000", "https://www.artsbyart.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: "artbyart",
      resource_type: isVideo ? "video" : "image",
      format: isVideo ? "mp4" : "jpg",
    };
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  await cors(req, res);
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
    const { imageId, videoId } = req.body;
    if (imageId) {
      try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }

        // Remove the image from Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.destroy(imageId);
        console.log("Cloudinary Response:", cloudinaryResponse);

        // Remove the image from the product document
        product.images = product.images.filter((image) => image !== imageId);
        await product.save();

        res
          .status(200)
          .json({ success: true, message: "Image deleted successfully" });
      } catch (error) {
        console.error("Error deleting image:", error);
        return res.status(500).json({ error: "Error deleting image" });
      }
    } else if (videoId) {
      try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }

        // Remove the video from Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.destroy(videoId, {
          resource_type: "video",
        });
        console.log("Cloudinary Response:", cloudinaryResponse);

        // Remove the video from the product document
        product.video = null;
        await product.save();

        res
          .status(200)
          .json({ success: true, message: "Video deleted successfully" });
      } catch (error) {
        console.error("Error deleting video:", error);
        return res.status(500).json({ error: "Error deleting video" });
      }
    } else  {
      try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          return res.status(404).json({ error: "Product not found" });
        }
        res
          .status(200)
          .json({ success: true, message: "Product deleted successfully" });
      } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ error: "Error deleting product" });
      }
    }
  } else if (req.method === "PUT") {
    try {
      await new Promise((resolve, reject) => {
        upload.fields([
          { name: "images", maxCount: 5 },
          { name: "video", maxCount: 1 },
        ])(req, res, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(req.files);
          }
        });
      });

      const { title, category, price, description, available, procedures } =
        req.body;
      const imageURLs = req.files.images
        ? req.files.images.map((file) => file.path)
        : [];
      const videoURL = req.files.video ? req.files.video[0].path : null;

      const updatedData = {
        title,
        category,
        price,
        description,
        available: available === "true",
        procedures: procedures
          ? procedures.split(",").map((proc) => proc.trim())
          : [],
      };

      if (imageURLs.length > 0) {
        updatedData.images = imageURLs;
      }
      if (videoURL) {
        updatedData.video = videoURL;
      }
      if (title) {
        updatedData.slug = slugify(title);
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res
        .status(200)
        .json({
          success: true,
          message: "Product updated successfully",
          updatedProduct,
        });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ error: "Error updating product" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
