//Nowy
// components/products/ProductsListPage.tsx
"use client";

import {SortOption} from "../../types/filters";
import {TypeProduct} from "../../types/product";
import {FiltersBar} from "./FiltersBar";
import {Pagination} from "./Pagination";
import ProductCard from "./ProductCard";

type Props = {
  gender: "mens" | "womens";
  mode: "all" | "bestseller" | "collection" | "sale" | "new";
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
  return (
    <section className="container mx-auto px-4 py-8">
      {/* 🔵 Nagłówek TYLKO dla ALL */}
      {mode === "all" && (
        <div className="text-center py-4">
          <h1 className="mb-6 text-2xl font-semibold">
            {gender === "mens" ? "MEN’S — CLOTHING" : "WOMEN’S — CLOTHING"}
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
            incidunt fugit ratione ducimus porro praesentium temporibus nam
            consequuntur earum aspernatur?
          </p>
        </div>
      )}

      {/* 🔵 Nagłówek dla bestseller */}
      {mode === "bestseller" && (
        <div className="text-center py-4">
          <h1 className="text-center text-xl font-semibold mb-6">
            {gender === "mens" ? "MEN’S — BESTSELLERS" : "WOMEN’S — BESTSELLER"}
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
            incidunt fugit ratione ducimus porro praesentium temporibus nam
            consequuntur earum aspernatur?
          </p>
        </div>
      )}

  {/* 🔵 Nagłówek dla sale */}
{mode === "sale" && (
  <h1 className="text-center text-xl font-semibold mb-6">
    SALE — {gender === "mens" ? "MEN’S" : "WOMEN’S"} COLLECTION
  </h1>
)}
  {/* 🔵 Nagłówek dla new */}
{mode === "new" && (
  <h1 className="text-center text-xl font-semibold mb-6">
    {gender === "mens" ? "MEN’S — NEW IN" : "WOMEN’S — NEW IN"}
  </h1>
)}


      {/* 🔵 Nagłówek dla collection */}
      {mode === "collection" && collectionSlug && (
        <div className="text-center py-4">
          <h1 className="text-center text-xl font-semibold mb-6">
            {gender === "mens" ? "MEN’S" : "WOMEN’S"} — COLLECTION{" "}
            {collectionSlug.toUpperCase()}
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
            incidunt fugit ratione ducimus porro praesentium temporibus nam
            consequuntur earum aspernatur?
          </p>
        </div>
      )}
      {/* ---------------------------------------------------- */}

      <FiltersBar
        selectedSizes={selectedSizes}
        selectedColors={selectedColors}
      />

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mt-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
        {products.length === 0 && <p>Brak produktów do wyświetlenia.</p>}
      </section>
      {/* 🔹 Paginacja */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-sm text-gray-500">
            Wyświetlane {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalItems)} z {totalItems}{" "}
            produktów
          </p>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </section>
  );
};

export default ProductsListPage;
