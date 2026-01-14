import { NextResponse } from "next/server";
import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../../../lib/cloudinary";
import { requireAdmin } from "../../../../lib/auth/requireAdmin";

type UploadedImage = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

const ALLOWED_FOLDERS = new Set(["products", "collections"]);
const MAX_MB = 8;
const MAX_BYTES = MAX_MB * 1024 * 1024;

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

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (max ${MAX_MB}MB)` },
      { status: 400 }
    );
  }

  const requested = String(formData.get("folder") ?? "products");
  const folderKey = ALLOWED_FOLDERS.has(requested) ? requested : "products";
  const folder = `tavros/${folderKey}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadToCloudinary(buffer, folder);


  const payload: UploadedImage = {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };

  return NextResponse.json({ ok: true, image: payload });
}
