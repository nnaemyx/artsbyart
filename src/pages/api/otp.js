import twilio from 'twilio';
import OTP from "@/models/otpModel"
const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.YOUR_TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    // Send OTP using Twilio
    try {
      await client.messages.create({
        body: `Your verification code is ${otp}`,
        from: twilioPhoneNumber,
        to: phone,
      });

      // Save OTP to MongoDB
      const otpData = new OTP({ phone, otp });
      await otpData.save();

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ success: false, error: 'Failed to send OTP' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
