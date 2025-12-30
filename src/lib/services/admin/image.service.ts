import { uploadImage } from "../../uploadImage";


export async function uploadProductImage(file: File) {
  // możesz tu dopisać walidacje typu/rozmiaru
  const uploaded = await uploadImage(file);
  return uploaded.url as string;
}
