export type PaymentStatus = "pending" | "paid" | "canceled";

export type FulfillmentStatus =
  | "created"
  | "processing"
  | "shipped"
  | "delivered"
  | "canceled";

export const ORDER_STEPS = [
  "Order placed",
  "Processing",
  "Shipped",
  "Delivered",
] as const;

export const FULFILLMENT_STEP_INDEX: Record<FulfillmentStatus, number> = {
  created: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  canceled: 0,
};

export type ProductImage = {
  src: string;
  alt?: string;
  primary?: boolean;
};

export type OrderItemProduct = {
  _id: string;
  slug: string;
  images?: ProductImage[];
  title?: string;
  price?: number;
  currency?: string;
};

export type OrderItems = {
  productId: OrderItemProduct;
  title: string;
  qty: number;
  price: number;
  size?:string;
  color?:string;
};

export type AccountOrder = {
  _id: string;
  orderNumber: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  createdAt: string;
  amountTotal: number;
  amountSubtotal?: number;
  shippingCost?: number;
  currency: string;
  items: OrderItems[];
};

export type OrdersResponse = {
  orders: AccountOrder[];
};

export type AccountOrderListRow = {
  _id: string;
  orderNumber: string;
  amountTotal: number;
  currency: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
};
