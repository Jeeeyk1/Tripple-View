import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ||"dont4fzqs",
  api_key: process.env.CLOUDINARY_API_KEY ||"269948275996984",
  api_secret: process.env.CLOUDINARY_API_SECRET ||"clR0RQY6ar1kl1QD38t-W1zouyg",
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadedUrls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64String, {
        folder: "condos",
      });

      uploadedUrls.push(uploadResponse.secure_url);
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      imageUrls: uploadedUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
