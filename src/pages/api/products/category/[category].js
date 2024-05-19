import connectDb from "@/lib/connectDB";
import Product from "@/models/productModel";

const handler = async (req, res) => {
  const { category } = req.query;

  if (req.method === "GET") {
    try {
      await connectDb();
      const products = await Product.find({ category });

      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching products" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
