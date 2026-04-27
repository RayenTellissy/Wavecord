import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireUserId } from "@/lib/auth";
import { checkRateLimit, tooManyRequests } from "@/lib/rateLimit";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "application/zip",
  "video/mp4",
  "video/webm",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();

    const rl = checkRateLimit(`upload:${userId}`, 15, 60 * 60_000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfter);

    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 5 MB limit" }, { status: 413 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 415 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    const resourceType: "image" | "video" | "raw" = isVideo
      ? "video"
      : isImage
      ? "image"
      : "raw";

    type CloudinaryResult = {
      secure_url: string;
      public_id: string;
      bytes: number;
      original_filename: string;
      format: string;
    };

    const result = await new Promise<CloudinaryResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,
            folder: "wavecord",
            use_filename: true,
            unique_filename: true,
          },
          (error, res) => {
            if (error || !res) reject(error ?? new Error("Upload failed"));
            else resolve(res as unknown as CloudinaryResult);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (err) {
    console.error("[UPLOAD]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
