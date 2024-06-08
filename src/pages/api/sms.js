// /pages/api/sms.js
import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber, message } = req.body;

    // Twilio credentials and configuration
    const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
    const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
    const from = process.env.YOUR_TWILIO_PHONE_NUMBER;
    const client = twilio(accountSid, authToken);

    // Set default message if not provided
    const defaultMessage = "Hello, you have a job to work on, visit the link,login to your account www.artsbyart.com/ICregister/AccountLogin and get started";
    const finalMessage = message ? `${message}` : defaultMessage;

    // Send SMS using Twilio
    const result = await client.messages.create({
      body: finalMessage,  // Use the final message
      from: from,
      to: phoneNumber,
    });

    // Return success response
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({ error: error.message });
  }
}
