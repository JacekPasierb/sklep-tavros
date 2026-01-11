import Product from "../../../models/Product";
import { ProductLean } from "../../../types/admin/productEdit";
import { connectToDatabase } from "../db/mongodb";


export async function getProductLeanById(id: string): Promise<ProductLean | null> {
  await connectToDatabase();
  const p = await Product.findById(id).lean<ProductLean>();
  return p ?? null;
}
