import {notFound} from "next/navigation";


import ProductDetails from "../../../../components/products/ProductDetails";
import Slider from "../../../../components/products/Slider";
import ProductGallery from "../../../../components/products/ProductGallery/ProductGallery";
import ProductInfoSections from "../../../../components/products/ProductInfoSections";
import { getProductBySlug, getRelatedProducts } from "../../../../lib/services/shop/products.service";

type PageProps = {
  params: {slug: string};
};

const ProductPage = async ({params}: PageProps) => {
  const {slug} = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  
  const imageUrls = (product.images ?? []).map((img) => img.src);


  const relatedProducts = await getRelatedProducts({
    gender: product.gender,
    collectionSlug: product.collectionSlug,
    excludeId: String(product._id),
    limit: 3,
  });

  // Overlay dla sale
  const hasSale =
    product.tags?.includes("sale") &&
    typeof product.oldPrice === "number" &&
    product.oldPrice > product.price;

  // Overlay dla new
  const isNew = product.tags?.includes("new");

  // Obliczanie zniżki
  const discountPercent = hasSale
    ? Math.round(
        ((product.oldPrice! - product.price) / product.oldPrice!) * 100
      )
    : 0;

  const overlay = (
    <>
      {hasSale && (
        <span
          className="
            absolute left-2 top-2 z-10
            bg-red-600 text-white text-xs font-bold 
            px-2 py-0.5 rounded shadow-md tracking-wide
          "
        >
          SALE -{discountPercent}%
        </span>
      )}

      {isNew && (
        <span
          className="
            absolute left-2 bottom-2 z-10
            inline-flex items-center rounded-full border border-[#F5D96B]
            bg-black/80 px-2 py-0.5 text-[10px] font-semibold uppercase
            tracking-[0.15em] text-[#F5D96B]
          "
        >
          NEW
        </span>
      )}
    </>
  );

  return (
    <section className="mx-auto w-full  lg:py-6 pb-4">
      <article className="grid gap-8  lg:grid-cols-[2fr_1fr] lg:items-start lg:container lg:mx-auto pb-[50px] lg:px-8 ">
        <ProductGallery
          images={imageUrls}
          title={product.title}
          overlay={overlay}
        />
        <ProductDetails product={product} />
        <ProductInfoSections product={product} />
      </article>

      <div>
        <Slider products={relatedProducts} title="Propose For You" />
      </div>
    </section>
  );
};
export default ProductPage;
