import connectDb from "@/lib/connectDB";
import Product from "@/models/productModel";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { NextResponse } from "next/server";
import slugify from "slugify";
import nextConnect from "next-connect";
import bodyParser from "body-parser";

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

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(bodyParser.json());

apiRoute.get(async (req, res) => {
  const { id } = req.query;
  await connectDb();
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
});

apiRoute.delete(async (req, res) => {
  const { id } = req.query;
  const { imageId, videoId } = req.body;

  await connectDb();

  if (imageId) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Remove the image from Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.destroy(imageId);
      console.log("Cloudinary Response:", cloudinaryResponse);

      // Remove the image from the product document
      product.images = product.images.filter(image => image !== imageId);
      await product.save();

      res.status(200).json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Error deleting image" });
    }
  } else if (videoId) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Remove the video from Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.destroy(videoId, { resource_type: "video" });
      console.log("Cloudinary Response:", cloudinaryResponse);

      // Remove the video from the product document
      product.video = null;
      await product.save();

      res.status(200).json({ success: true, message: "Video deleted successfully" });
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ error: "Error deleting video" });
    }
  } else {
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
  }
});

apiRoute.put(async (req, res) => {
  await connectDb();
  try {
    await new Promise((resolve, reject) => {
      upload.fields([{ name: "images", maxCount: 5 }, { name: "video", maxCount: 1 }])(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(req.files);
        }
      });
    });

    const { title, category, price, description, available, procedures } = req.body;
    const imageURLs = req.files.images ? req.files.images.map((file) => file.path) : [];
    const videoURL = req.files.video ? req.files.video[0].path : null;

    const updatedData = {
      title,
      category,
      price,
      description,
      available: available === "true",
      procedures: procedures ? procedures.split(',').map(proc => proc.trim()) : [],
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

    const updatedProduct = await Product.findByIdAndUpdate(req.query.id, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Error updating product" });
  }
});

export default apiRoute;
