// /api/reset-password.js
import connectDb from "@/lib/connectDB";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import { hash } from "bcryptjs";

const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  await connectDb();

  if (req.method === 'POST') {
    const { token, password } = req.body;

    try {
      // Verify token
      const decoded = jwt.verify(token, jwtSecret);
      const phone = decoded.phone;

      // Log token and decoded information
      console.log("Token:", token);
      console.log("Decoded:", decoded);

      // Find the user by phone number
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const hashedPassword = await hash(password, 12);
      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
