// components/products/ProductsListPage.tsx
"use client";

import type {SortOption} from "../../types/filters";
import type {TypeProduct} from "../../types/product";
import type {ShopGender} from "../../types/shop/productsList";

import EmptyState from "../common/EmptyState";
import {FiltersBar} from "./FiltersBar";
import {Pagination} from "./Pagination";
import ProductCard from "./ProductCard";

import {getProductsListHeading} from "../../lib/utils/shop/productsListHeadings";

type Mode = "all" | "bestseller" | "collection" | "sale" | "new";

type Props = {
  gender: ShopGender;
  mode: Mode;
  collectionSlug?: string;

  products: TypeProduct[];
  selectedSizes?: string[];
  selectedColors?: string[];

  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  selectedSort?: SortOption;
};

const ProductsListPage = ({
  gender,
  mode,
  collectionSlug,
  products,
  selectedSizes,
  selectedColors,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: Props) => {
  // bazowy path do "Wyczyść filtry" (bez query)
  const basePath =
    mode === "all"
      ? `/${gender}/all`
      : mode === "bestseller"
      ? `/${gender}/bestseller`
      : mode === "sale"
      ? `/${gender}/sale`
      : mode === "new"
      ? `/${gender}/new`
      : mode === "collection" && collectionSlug
      ? `/${gender}/collection/${collectionSlug}`
      : `/${gender}/all`;

  const heading = getProductsListHeading({gender, mode, collectionSlug});

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="mb-6 text-2xl font-semibold">{heading.title}</h1>

        {heading.description && (
          <p className="text-sm text-zinc-600 max-w-2xl mx-auto">
            {heading.description}
          </p>
        )}
      </div>

      {/* Sticky bar – mobile compact */}
      <div className="sticky top-[65px] z-40 -mx-4 px-4 bg-white/90 backdrop-blur border-b border-zinc-200 md:top-[80px]">
        <div className="py-3">
          <FiltersBar
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
          />
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState path={basePath} />
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mt-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </section>

          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
                products
              </p>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductsListPage;
