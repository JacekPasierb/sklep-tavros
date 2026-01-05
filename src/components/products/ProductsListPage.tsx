"use client";

import type {TypeProduct} from "../../types/product";
import type {ProductsListMode, ShopGender} from "../../types/shop/productsList";

import {FiltersBar} from "./FiltersBar";
import {Pagination} from "./Pagination";
import ProductCard from "./ProductCard";

import {getProductsListHeading} from "../../lib/utils/shop/productsListHeadings";
import {getProductsListBasePath} from "../../lib/utils/shop/productsListBasePath";
import EmptyState from "../common/EmptyState";

type Props = {
  gender: ShopGender;
  mode: ProductsListMode;
  collectionSlug?: string;

  products: TypeProduct[];
  selectedSizes?: string[];
  selectedColors?: string[];

  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;

  availableSizes: string[];
  availableColors: string[];
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
  availableSizes,
  availableColors,
}: Props) => {
  const basePath = getProductsListBasePath({gender, mode, collectionSlug});
  const heading = getProductsListHeading({gender, mode, collectionSlug});

  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="py-4 text-center">
        <h1 className="mb-6 text-2xl font-semibold">{heading.title}</h1>

        {heading.description ? (
          <p className="mx-auto max-w-2xl text-sm text-zinc-600">
            {heading.description}
          </p>
        ) : null}
      </div>

      <div className="sticky top-[65px] z-40 -mx-4 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur md:top-[80px]">
        <div className="py-3">
          <FiltersBar
            availableSizes={availableSizes}
            availableColors={availableColors}
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
          />
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState path={basePath} />
      ) : (
        <>
          <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </section>

          {totalPages > 1 ? (
            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-sm text-gray-500">
                Showing {start}–{end} of {totalItems} products
              </p>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          ) : null}
        </>
      )}
    </section>
  );
};

export default ProductsListPage;
