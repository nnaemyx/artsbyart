import connectDb from "@/lib/connectDB";
import { NextResponse } from "next/server";
import Procedure from "@/models/procedureModel";

export async function PUT(request, { params }) {
  const { id } = params;
  const { newDescription: description } = await request.json();
  await connectDb();
  await Procedure.findByIdAndUpdate(id, {  description });
  return NextResponse.json({ message: "Topic updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectDb();
    const topic = await Procedure.findOne({ _id: id });
  return NextResponse.json({ topic }, { status: 200 });
}