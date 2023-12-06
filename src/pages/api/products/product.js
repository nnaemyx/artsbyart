import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Product from "@/models/productModel";
import connectDb from "@/lib/connectDB";
import initMiddleware from "@/utils/init-Middleware";
import Cors from "cors";
import slugify from "slugify";

const cors = initMiddleware(
  Cors({
    // Set allowed origins based on your requirements
    origin: ["http://localhost:3000"],
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
  params: {
    folder: "artbyart",
    format: async (req, file) => "jpg",
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
        upload.array("images", 5)(req, res, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(req.files);
          }
        });
      });

      const imageURLs = result.map((file) => file.path);

      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }

      const newProduct = await Product.create({
        ...req.body,
        images: imageURLs,
      });

      res.json(newProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading product" });
    }
  } else if (req.method === "GET") {
    if (req.query.id) {
      const { id } = req.query;
      validateMongoDbId(id);
      try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error uploading product" });
      }
    } else {
      // Handle getting all products
      try {
        await connectDb();
        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
          /\b(gte|gt|lte|lt)\b/g,
          (match) => `$${match}`
        );

        let query = Product.find(JSON.parse(queryStr));

        // Sorting

        if (req.query.sort) {
          const sortBy = req.query.sort.split(",").join(" ");
          query = query.sort(sortBy);
        } else {
          query = query.sort("-createdAt");
        }

        // limiting the fields

        if (req.query.fields) {
          const fields = req.query.fields.split(",").join(" ");
          query = query.select(fields);
        } else {
          query = query.select("-__v");
        }

        // pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
          const productCount = await Product.countDocuments();
          if (skip >= productCount)
            throw new Error("This Page does not exists");
        }
        const product = await query;
        res.json(product);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error uploading product" });
      }
    }
  } else if (req.method === "PUT") {
    // Your existing PUT logic here
    const { id } = req.query;
    validateMongoDbId(id);
    try {
      await connectDb();
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedProduct) {
        throw new Error("Product not found");
      }
      res.json(updatedProduct);
    } catch (error) {
      throw new Error(error);
    }
  } else if (req.method === "DELETE") {
    // Your existing DELETE logic here
    const { id } = req.query;
    validateMongoDbId(id);
    try {
      await connectDb();
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        throw new Error("Product not found");
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting product" });
    }
  }
}

export default handler;
