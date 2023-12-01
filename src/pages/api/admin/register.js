import Admin from "@/models/adminModel";
import connectDb from '@/lib/connectDB';
import { hash } from "bcryptjs";

connectDb();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create a new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    // Save the admin to the database
    await newAdmin.save();

    return res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
