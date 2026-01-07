import {notFound} from "next/navigation";

import ProductDetails from "../../../../components/products/ProductDetails";
import Slider from "../../../../components/products/Slider";
import ProductGallery from "../../../../components/products/ProductGallery/ProductGallery";
import ProductInfoSections from "../../../../components/products/ProductInfoSections";
import ProductOverlay from "../../../../components/products/ProductOverlay";

import {
  getProductBySlug,
  getRelatedProducts,
} from "../../../../lib/services/shop/products.service";

import {
  getProductImageUrls,
  getSaleState,
} from "../../../../lib/utils/shop/products/view";

type PageProps = {
  params: {slug: string};
};

const ProductPage = async ({params}: PageProps) => {
  const {slug} = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const imageUrls = getProductImageUrls(product);
  const sale = getSaleState(product);

  const relatedProducts = await getRelatedProducts({
    gender: product.gender,
    collectionSlug: product.collectionSlug,
    excludeId: String(product._id),
    limit: 3,
  });

  return (
    <section className="mx-auto w-full  lg:py-6 pb-4">
      <article className="grid gap-8  lg:grid-cols-[2fr_1fr] lg:items-start lg:container lg:mx-auto pb-[50px] lg:px-8 ">
        <ProductGallery
          images={imageUrls}
          title={product.title}
          overlay={<ProductOverlay sale={sale} />}
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
