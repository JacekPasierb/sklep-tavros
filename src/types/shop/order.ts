// export type PaymentStatus = "pending" | "paid" | "canceled";

import {  PaymentStatus } from "../(shop)/account/orders";



export type AccountOrderListRow = {
  _id: string;
  orderNumber: string;
  amountTotal: number;
  currency: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
};
