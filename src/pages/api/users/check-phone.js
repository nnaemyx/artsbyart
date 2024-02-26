// pages/api/users/check-phone.js
import connectDB from "@/lib/connectDB";
import User from "@/models/userModel";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            await connectDB();

            const { phone } = req.body;

            // Check if the phone number already exists
            const existingUser = await User.findOne({ phone });

            // Return the result as JSON
            res.status(200).json({
                exists: !!existingUser, // Convert to boolean
            });
        } catch (error) {
            console.error("Error checking phone:", error);
            res.status(500).json({ message: "An error occurred" });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
