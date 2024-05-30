// /pages/api/sms.js
import { NextResponse } from "next/server";
import twilio from "twilio";

export const config = {
  runtime: "edge",
};

export default async function POST(request) {
  try {
    const { phoneNumber, message } = await request.body();

    // Twilio credentials and configuration
    const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
    const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
    const from = process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER;
    const client = twilio(accountSid, authToken);

    // Send SMS using Twilio
    const result = await client.messages.create({
      body: message || "Hello, you have a job to work on, visit the link and get started",
      from: from,
      to: phoneNumber,
    });

    // Return success response
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
