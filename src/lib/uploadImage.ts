// lib/uploadImage.ts
export type UploadFolder = "products" | "collections";

export const uploadImage = async (
  file: File,
  folder: UploadFolder = "products"
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "Upload failed");

  return data.image as {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
  };
};
