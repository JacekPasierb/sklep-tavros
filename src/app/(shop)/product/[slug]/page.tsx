import {notFound} from "next/navigation";
import ProductGallery from "../../components/ProductGallery";

import ProductInfo from "../../components/ProductInfo";
import {InterfaceProduct} from "../../types/globalTypes";

import Slider from "../../components/Slider";
import {getProductBySlug, getRelatedProducts} from "../../lib/products1";

const ProductPage = async ({params}: {params: Promise<{slug: string}>}) => {
  const {slug} = await params;

  const productDoc = await getProductBySlug(slug);
  if (!productDoc) notFound();
  console.log("PRP", productDoc);

  const imageUrls = productDoc.images || [];

  const product: InterfaceProduct = {
    _id: String(productDoc._id),
    title: String(productDoc.title),
    price: Number(productDoc.price),
    currency: productDoc.currency ? String(productDoc.currency) : undefined,
    images: imageUrls,
    variants: productDoc.variants
      ? productDoc.variants.map(
          (v: {size: string; sku: string; stock: number; color?: string}) => ({
            size: String(v.size),
            sku: String(v.sku),
            stock: Number(v.stock),
            color: v.color ? String(v.color) : undefined,
          })
        )
      : undefined,
    slug: String(productDoc.slug),
    gender: productDoc.gender,
    collectionSlug: productDoc.collectionSlug,
  };

  const related = await getRelatedProducts({
    gender: productDoc.gender,
    collectionSlug: productDoc.collectionSlug,
    excludeId: String(productDoc._id),
    limit: 3,
  });

  const relatedProducts = related.map((p) => ({
    _id: String(p._id),
    slug: String(p.slug),
    title: String(p.title),
    price: Number(p.price),
    images: p.images || [],
  }));

  return (
    <section className="mx-auto w-full  lg:py-6 pb-4">
      <article className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start lg:container lg:mx-auto pb-[50px] lg:px-8 ">
        <ProductGallery images={imageUrls} title={productDoc.title} />
        <ProductInfo product={product} />
      </article>
      <div>
        <Slider
          products={relatedProducts}
          product={product}
          collectionSlug={productDoc.collectionSlug}
          title="Propose For You"
        />
      </div>
    </section>
  );
};
export default ProductPage;
