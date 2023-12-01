// pages/api/auth.js
import connectDb from "@/lib/connectDB";
import User from "@/models/userModel";

export default async function handler(req, res) {
  await connectDb();

  if (req.method === "POST") {
    const { phone, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ phone });

      if (existingUser) {
        // User exists, check the password
        if (existingUser.comparePassword(password)) {
          // Password is correct, login successful
          res.json({ message: "Login successful." });
        } else {
          // Password is incorrect
          res.status(401).json({ message: "Incorrect password. Please try again." });
        }
      } else {
        // User does not exist, prompt to create an account
        res.json({ message: "User does not exist. Please create an account." });
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
