import {uploadImage} from "../../uploadImage";

export const uploadProductImage = async (file: File) => {
  // możesz tu dopisać walidacje typu/rozmiaru
  const uploaded = await uploadImage(file, "products");
  return uploaded.url as string;
};
