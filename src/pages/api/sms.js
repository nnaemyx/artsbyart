import { NextResponse } from 'next/server';
import twilio from 'twilio'

export async function POST(request) {
  const accountSid = "YOUR_TWILIO_ACCOUNT_SID";
  const authToken = "YOUR_TWILIO_AUTH_TOKEN";
  const from = "YOUR_TWILIO_PHONE_NUMBER";
  const client = require('twilio')(accountSid, authToken);

  const {phone_num1, message} = await request.json();

  const result = await client.messages.create({
    body:message,
    from:from,
    to:phone_num1
  });

  return NextResponse.json({message:"success"}, {status:200})
}
