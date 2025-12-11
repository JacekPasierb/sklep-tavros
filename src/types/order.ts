export type OrderItem = {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    currency: string;
    status: string;
    createdAt: string;
  };

  // app/(account)/account/orders/page.tsx
  export type OrderItems = {
    productId: OrderItemProduct;
    title: string;
    qty: number;
    price: number;
  };

  export type FulfillmentStatus =
  | "created"
  | "processing"
  | "shipped"
  | "delivered"
  | "canceled";

// stałe kroki timeline
export const ORDER_STEPS = [
  "Order placed",
  "Processing",
  "Shipped",
  "Delivered",
] as const;

// mapowanie statusu na index kroku
export const FULFILLMENT_STEP_INDEX: Record<FulfillmentStatus, number> = {
  created: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  canceled: 0,
};

export type OrderItemProduct = {
  _id: string;
  slug: string;
  images?: string[];
  title?: string;
  price?: number;
  currency?: string;
};



export type AccountOrder = {
  _id: string;
  orderNumber: string;
  paymentStatus: "pending" | "paid" | "canceled";
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
  