import OTP from "@/models/otpModel"

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { phone, otp } = req.body;
  
      try {
        // Find OTP data in MongoDB
        const storedOtp = await OTP.findOne({ phone });
        console.log(storedOtp);
  
        if (storedOtp) {
          if (storedOtp.otp == otp) {
            // Clear OTP after successful validation
            await OTP.deleteOne({ phone });
            res.status(200).json({ success: true });
          } else {
            res.status(200).json({ success: false, message: 'Invalid OTP' });
          }
        } else {
          res.status(200).json({ success: false, message: 'No OTP found or OTP expired' });
        }
      } catch (error) {
        console.error('Error validating OTP:', error);
        res.status(500).json({ success: false, error: 'Error validating OTP' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  