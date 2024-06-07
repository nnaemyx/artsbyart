import connectDb from "@/lib/connectDB";
import User from "@/models/userModel";

export default async function handler(req, res) {
  await connectDb();

  if (req.method === "POST") {
    const { phone, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ phone });
      const passwordIsCorrect = await (password, existingUser.password);

      if (existingUser) {
        if (passwordIsCorrect) {
          // Wrap user data in newUser object
          const newUser = { phone: existingUser.phone, password: existingUser.password };
          res.status(201).json(newUser);
          res.json({ message: "Login successful." });
        } else {
          res.status(401).json({ message: "Incorrect password. Please try again." });
        }
      } else {
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
