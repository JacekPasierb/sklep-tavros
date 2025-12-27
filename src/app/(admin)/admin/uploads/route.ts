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

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const folder = String(formData.get("folder") ?? "tavros/products");

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, res) => {
        if (error) return reject(error);
        if (!res) return reject(new Error("No response from Cloudinary"));
        resolve(res);
      }
    );

    stream.end(buffer);
  });

  const payload: UploadedImage = {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };

  return NextResponse.json({ ok: true, image: payload });
}
