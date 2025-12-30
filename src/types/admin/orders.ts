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
};

export type OrdersResult = {
  orders: PublicOrder[];
  total: number;
  page: number;
  pages: number;
  limit: number;
};
