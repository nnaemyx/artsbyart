import { NextResponse } from "next/server";
import twilio from "twilio";

export default  async function POST(request) {
  // Twilio credentials and configuration
  const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
  const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
  const from = process.env.YOUR_TWILIO_PHONE_NUMBER;
  const client = require("twilio")(accountSid, authToken);

  // Extract phone number from the request body
  const { phoneNumber } = await request.body;

  // Send SMS using Twilio
  const result = await client.messages.create({
    body: "Hello, you have a job to work on, visit the link and get started",
    from: from,
    to: phoneNumber,
  });

  // Return success response
  return NextResponse.json({ message: "success" }, { status: 200 });
}
