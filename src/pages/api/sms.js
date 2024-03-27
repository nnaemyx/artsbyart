import { NextResponse } from "next/server";
import twilio from "twilio";

export default  async function POST(request) {
  // Twilio credentials and configuration
  const accountSid = "ACd1a4fd485e2a5e65b632ad4243eea338";
  const authToken = "a4eb5ec6092a51de89b2a5a942ebf088";
  const from = "+19282362066";
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
