import {notFound} from "next/navigation";
// import ProductGallery from "../../components/ProductGallery";

// import ProductInfo from "../../components/ProductInfo";
// import {InterfaceProduct} from "../../types/globalTypes";

// import Slider from "../../components/Slider";
import {getProductBySlug, getRelatedProducts} from "../../../lib/products";

import ProductDetails from "../../../../components/products/ProductDetails";
import Slider from "../../../../components/products/Slider";
import ProductGallery from "../../../../components/products/ProductGallery/ProductGallery";

// import {getProductBySlug, getRelatedProducts} from "../../lib/products1";

type PageProps = {
  params: {slug: string};
};

const ProductPage = async ({params}: PageProps) => {
  const {slug} = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const imageUrls = product.images || [];

  // const product: InterfaceProduct = {
  //   _id: String(productDoc._id),
  //   title: String(productDoc.title),
  //   price: Number(productDoc.price),
  //   currency: productDoc.currency ? String(productDoc.currency) : undefined,
  //   images: imageUrls,
  //   variants: productDoc.variants
  //     ? productDoc.variants.map(
  //         (v: {size: string; sku: string; stock: number; color?: string}) => ({
  //           size: String(v.size),
  //           sku: String(v.sku),
  //           stock: Number(v.stock),
  //           color: v.color ? String(v.color) : undefined,
  //         })
  //       )
  //     : undefined,
  //   slug: String(productDoc.slug),
  //   gender: productDoc.gender,
  //   collectionSlug: productDoc.collectionSlug,
  // };

  const related = await getRelatedProducts({
    gender: product.gender,
    collectionSlug: product.collectionSlug,
    excludeId: String(product._id),
    limit: 3,
  });

  const relatedProducts = related.map((p) => ({
    _id: String(p._id),
    slug: String(p.slug),
    title: String(p.title),
    price: Number(p.price),
    images: p.images || [],
    gender: String(p.gender),
    collectionSlug: String(p.collectionSlug),
  }));

  return (
    <section className="mx-auto w-full  lg:py-6 pb-4">
      <article className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start lg:container lg:mx-auto pb-[50px] lg:px-8 ">
        <ProductGallery images={imageUrls} title={product.title} />
        <ProductDetails product={product} />
      </article>
      <div>
        <Slider products={relatedProducts} title="Propose For You" />
      </div>
    </section>
  );
};
export default ProductPage;
