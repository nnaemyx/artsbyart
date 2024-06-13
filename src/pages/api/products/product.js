import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Product from "@/models/productModel";
import connectDb from "@/lib/connectDB";
import initMiddleware from "@/utils/init-Middleware";
import Cors from "cors";
import slugify from "slugify";

// Initialize CORS middleware
const cors = initMiddleware(
  Cors({
    origin: ["http://localhost:3000", "https://www.artsbyart.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

// Configure Cloudinary storage for multer
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
  },
};

async function handler(req, res) {
  await cors(req, res);

  if (req.method === "POST") {
    try {
      await connectDb();

      const result = await new Promise((resolve, reject) => {
        upload.fields([{ name: "images", maxCount: 5 }, { name: "video", maxCount: 1 }])(req, res, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(req.files);
          }
        });
      });

      const imageURLs = result.images ? result.images.map((file) => file.path) : [];
      const videoURL = result.video ? result.video[0].path : null;

      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }

      const procedures = req.body.procedures ? req.body.procedures.split(',').map(proc => proc.trim()) : [];

      const newProduct = await Product.create({
        ...req.body,
        images: imageURLs,
        video: videoURL,
        procedures: procedures,
        available: req.body.available === "true" // Ensure this is properly handled
      });

      res.json(newProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading product" });
    }
  } else if (req.method === "GET") {
    try {
      await connectDb();
      const products = await Product.find();

      const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = { products: [], images: [], video: [], price: [], procedures: [], available: [] };
        }

        acc[product.category].products.push(product);
        acc[product.category].images.push(...product.images);
        if (product.video) {
          acc[product.category].video.push(product.video);
        }
        acc[product.category].price.push(product.price);
        acc[product.category].procedures.push(...product.procedures);
        acc[product.category].available.push(product.available); // Include availability

        return acc;
      }, {});

      res.json(groupedProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching products" });
    }
  }
}

export default handler;
