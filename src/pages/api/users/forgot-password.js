import connectDb from "@/lib/connectDB";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import twilio from "twilio";

const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.YOUR_TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);
const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  await connectDb();

  if (req.method === 'POST') {
    let { phone } = req.body;

    try {
      // Remove +234 prefix for database query
      if (phone.startsWith("+234")) {
        phone = phone.slice(4);
      }

      // Find user by phone number
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Generate reset token
      const resetToken = jwt.sign({ phone: user.phone }, jwtSecret, { expiresIn: '1h' });

      // Generate reset link
      const resetLink = `${process.env.FRONTEND_URL}/authentication/ResetPassword?token=${resetToken}`;

      // Add +234 prefix for sending SMS
      const phoneWithPrefix = `+234${user.phone}`;

      // Send reset link via SMS
      await client.messages.create({
        body: `Reset your password using the following link: ${resetLink}`,
        from: twilioPhoneNumber,
        to: phoneWithPrefix,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending reset link:', error);
      res.status(500).json({ success: false, error: 'Failed to send reset link' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
