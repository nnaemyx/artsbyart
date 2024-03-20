import { NextResponse } from 'next/server';
import twilio from 'twilio';

export default async function handler(request) {
  try {
    // Twilio credentials and configuration
    const accountSid = "YOUR_TWILIO_ACCOUNT_SID";
    const authToken = "YOUR_TWILIO_AUTH_TOKEN";
    const from = "YOUR_TWILIO_PHONE_NUMBER";
    const client = require('twilio')(accountSid, authToken);

    // Extract phone number from the request body
    const { phoneNumber, messageBody } = await request.json();

    // Send SMS using Twilio
    const result = await client.messages.create({
      body: messageBody || "Hello, you have a job to work on, visit the link and get started",
      from: from,
      to: phoneNumber
    });

    // Return success response
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    // Handle errors
    console.error("Error sending SMS:", error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
