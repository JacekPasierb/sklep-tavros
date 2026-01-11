import Order from "../../../models/Order";
import {OrderRow, OrdersQuery, OrdersResult} from "../../../types/admin/orders";
import {toPublicOrder} from "../../mappers/admin/orders.mapper";

import {connectToDatabase} from "../db/mongodb";

const buildOrdersFilter = (query: OrdersQuery): Record<string, unknown> => {
  const filter: Record<string, unknown> = {};

  if (query.q) {
    filter.$or = [
      {orderNumber: {$regex: query.q, $options: "i"}},
      {email: {$regex: query.q, $options: "i"}},
      {"customer.email": {$regex: query.q, $options: "i"}},
      {"customer.firstName": {$regex: query.q, $options: "i"}},
      {"customer.lastName": {$regex: query.q, $options: "i"}},
    ];
  }

  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.fulfillmentStatus)
    filter.fulfillmentStatus = query.fulfillmentStatus;

  return filter;
};

const getAdminOrders = async (query: OrdersQuery): Promise<OrdersResult> => {
  await connectToDatabase();

  const filter = buildOrdersFilter(query);

  const total = await Order.countDocuments(filter);
  const limit = query.limit;
  const pages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(query.page, pages);

  const rows = await Order.find(filter)
    .sort({createdAt: -1})
    .skip((page - 1) * query.limit)
    .limit(query.limit)
    .select({
      orderNumber: 1,
      email: 1,
      amountTotal: 1,
      currency: 1,
      paymentStatus: 1,
      fulfillmentStatus: 1,
      createdAt: 1,
      customer: 1,
      items: 1,
      shippingMethod: 1,
    })
    .lean<OrderRow[]>();

  return {
    orders: rows.map(toPublicOrder),
    total,
    page,
    pages,
    limit: query.limit,
  };
};

export default getAdminOrders;
