import IC from "@/models/icModel";
import connectDb from "@/lib/connectDB";
import { compare } from "bcryptjs";

connectDb();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { 
    phoneNumber1, password } = req.body;

  try {
    // Find the admin by email
    const ic = await IC.findOne({
      phoneNumber1,
    });

    if (!ic) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the entered password matches the hashed password in the database
    const passwordIsCorrect = await compare(password, ic.password);

    if (!passwordIsCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
