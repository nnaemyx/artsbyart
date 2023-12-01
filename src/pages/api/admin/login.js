import Admin from "@/models/adminModel";
import connectDb from '@/lib/connectDB';
import { compare } from "bcryptjs";

connectDb();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the entered password matches the hashed password in the database
    const passwordIsCorrect = await compare(password, admin.password);

    if (!passwordIsCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ message: 'Login successful' });
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}