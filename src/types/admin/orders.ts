import { Customer } from "../customer";
import { FulfillmentStatus, PaymentStatus } from "../order";

/**
 * OrdersSearchParams
 *
 * Typ opisujący parametry wyszukiwania przekazywane z URL (searchParams)
 * w panelu admina – dokładnie w takiej postaci, w jakiej przychodzą
 * z Next.js (jako stringi).
 *
 * Ten typ jest używany:
 * - w page.tsx (AdminOrdersPage),
 * - przed normalizacją danych.
 */
export type OrdersSearchParams = {
  page?: string;
  limit?:string;
  q?: string;
  paymentStatus?: PaymentStatus | "";
  fulfillmentStatus?: FulfillmentStatus | "";
};

/**
 * OrdersQuery
 *
 * Znormalizowana wersja parametrów wyszukiwania zamówień,
 * gotowa do użycia w warstwie serwisowej (DB).
 *
 * Ten typ powstaje na podstawie OrdersSearchParams
 * (np. przez normalizeOrdersQuery).
 *
 * Różnice względem OrdersSearchParams:
 * - page i limit są liczbami,
 * - q zawsze jest stringiem,
 * - typy są spójne i bezpieczne do użycia w zapytaniach do bazy.
 */
export type OrdersQuery = {
  page: number;
  limit: number;
  q: string;
  paymentStatus: PaymentStatus | "";
  fulfillmentStatus: FulfillmentStatus | "";
};

/**
 * PublicOrderItem
 *
 * Publiczny (bezpieczny) typ pojedynczej pozycji zamówienia,
 * przeznaczony do wyświetlania w panelu admina lub zwracania z API.
 *
 * Nie zawiera danych technicznych ani wewnętrznych struktur DB.
 */
export type PublicOrderItem = {
  slug?: string;
  title?: string;
  price?: number;
  qty?: number;
  size?: string;
  color?: string;
};

/**
 * PublicOrder
 *
 * Publiczny typ zamówienia przeznaczony do:
 * - UI (panel admina),
 * - API,
 * - list, tabel, widoków szczegółowych.
 *
 * Jest to wynik przemapowania danych z bazy (OrderRow)
 * za pomocą mappera (toPublicOrder).
 *
 * ❗ Ten typ NIE powinien zawierać:
 * - ObjectId,
 * - Date,
 * - pól wewnętrznych lub technicznych.
 */
export type PublicOrder = {
  id: string;
  orderNumber: string;
  email: string;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
  customer?: Customer | null;
  items: PublicOrderItem[];
  shippingMethod?: "standard" | "express";
  shippingCost?: number;
};

/**
 * OrdersResult
 *
 * Typ odpowiedzi zwracanej przez serwis pobierający listę zamówień
 * (getAdminOrders).
 *
 * Zawiera:
 * - listę zamówień w formacie PublicOrder,
 * - dane do paginacji.
 */
export type OrdersResult = {
  orders: PublicOrder[];
  total: number;
  page: number;
  pages: number;
  limit: number;
};

/**
 * OrderRow
 *
 * Typ wewnętrzny reprezentujący pojedynczy rekord zamówienia
 * w formacie zwracanym bezpośrednio z bazy danych (MongoDB).
 *
 * ❗ Ten typ NIE jest używany w UI ani w API.
 * Służy wyłącznie jako warstwa pośrednia:
 *
 * MongoDB (Order) → OrderRow → PublicOrder
 *
 * OrderRow może zawierać:
 * - pola opcjonalne,
 * - typy specyficzne dla bazy (Date, ObjectId),
 * - dane nieprzetworzone (np. currency w lowercase).
 *
 * Każdy OrderRow powinien zostać przemapowany
 * do bezpiecznego formatu (`PublicOrder`)
 * za pomocą mappera (`toPublicOrder`).
 */
export type OrderRow = {
  _id: unknown;
  orderNumber: string;
  email: string;
  amountTotal?: number | null;
  currency?: string | null;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: Date;
  customer?: Customer | null;
  items?: Array<{
    slug?: string;
    title?: string;
    price?: number;
    qty?: number;
    size?: string;
    color?: string;
  }>;
  shippingMethod?: "standard" | "express";
  shippingCost?: number;
};
