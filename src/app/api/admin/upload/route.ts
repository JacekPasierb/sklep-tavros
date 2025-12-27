import { NextResponse } from "next/server";
import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../../../lib/cloudinary";
import { requireAdmin } from "../../../../lib/utils/requireAdmin";

type UploadedImage = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

function uploadToCloudinary(buffer: Buffer, folder: string) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("No result"));
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const folder = String(formData.get("folder") ?? "tavros/products");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await uploadToCloudinary(buffer, folder);

  const payload: UploadedImage = {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };

  return NextResponse.json({ ok: true, image: payload });
}
