// pages/api/auth.js
import connectDb from "@/lib/connectDB";
import User from "@/models/userModel";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  await connectDb();

  if (req.method === "POST") {
    const { phone, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ phone });
      const hashedPassword = await hash(password, 12);

      if (existingUser) {
        // User already exists, ask for password
        res.status(422).json({ message: "User already exists" });
        return;
      } else {
        // New user, create account
        const newUser = new User({ phone, password:hashedPassword });
        await newUser.save();
        res.json({ newUser });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}
