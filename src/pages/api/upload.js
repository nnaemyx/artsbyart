import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Product from "@/models/productModel";
import connectDb from "@/lib/connectDB";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "artbyart", // Optional: You can specify a folder in Cloudinary.
    format: async (req, file) => "jpg", // Example: Set the format to PNG.
  },
});

const upload = multer({ storage });

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectDb();
      // Upload the image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        upload.single("image")(req, res, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(req.file);
          }
        });
      });
      const imageURL = result.path;

      const productSlug = req.query.productSlug; // Use req.query.productSlug to get the product slug from the request query

      // Find the product by slug instead of ID
      const product = await Product.findOne({ slug: productSlug });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (!product.images) {
        product.images = [];
      }
      // Create a new document in MongoDB with the Cloudinary image URL
      product.images.push(imageURL);
      await product.save();

      res.status(200).json({ message: "Image uploaded successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading image" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
