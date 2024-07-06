import connectDB from "@/lib/connectDB";
import Wishlist from "@/models/Wishlist";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const wishlist = await Wishlist.findOne().populate('products');
        res.status(200).json({ success: true, data: wishlist });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'POST':
      try {
        let wishlist = await Wishlist.findOne();

        if (!wishlist) {
          wishlist = new Wishlist({ products: [] });
        }

        const { productId } = req.body;

        if (wishlist.products.includes(productId)) {
          wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        } else {
          wishlist.products.push(productId);
        }

        await wishlist.save();
        res.status(200).json({ success: true, data: wishlist });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
};
