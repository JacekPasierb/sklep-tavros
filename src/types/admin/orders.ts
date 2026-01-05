import { Customer } from "../customer";
import { FulfillmentStatus, PaymentStatus } from "../order";


export type OrdersSearchParams = {
  page?: string;
  q?: string;
  paymentStatus?: PaymentStatus | "";
  fulfillmentStatus?: FulfillmentStatus | "";
};

export type OrdersQuery = {
  page: number;
  limit: number;
  q: string;
  paymentStatus: PaymentStatus | "";
  fulfillmentStatus: FulfillmentStatus | "";
};

export type PublicOrderItem = {
  slug?: string;
  title?: string;
  price?: number;
  qty?: number;
  size?: string;
  color?: string;
};

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

export type OrdersResult = {
  orders: PublicOrder[];
  total: number;
  page: number;
  pages: number;
  limit: number;
};
