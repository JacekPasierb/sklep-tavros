// lib/uploadImage.ts
export async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "tavros/products");
  
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) {
      throw new Error("Upload failed");
    }
  
    const data = await res.json();
    return data.image as {
      url: string;
      publicId: string;
      width?: number;
      height?: number;
    };
  }
  