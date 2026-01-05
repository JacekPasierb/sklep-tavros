import Order from "../../../models/Order";
import Product from "../../../models/Product";
import User from "../../../models/User";
import {AdminMetrics} from "../../../types/admin/metrics";
import {connectToDatabase} from "../../mongodb";

function startOfThisMonthUTC() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)
  );
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  await connectToDatabase();

  const monthStart = startOfThisMonthUTC();

  const [
    usersCount,

    productsTotal,
    productsActive,
    productsHidden,

    ordersTotal,
    ordersPending,
    ordersPaid,
    ordersCanceled,

    ordersToShip,
    ordersShipped,
    ordersDelivered,

    revenueAllTimeAgg,
    revenueThisMonthAgg,
  ] = await Promise.all([
    User.countDocuments({role: {$ne: "admin"}}),

    Product.countDocuments({}),
    Product.countDocuments({status: "ACTIVE"}),
    Product.countDocuments({status: "HIDDEN"}),

    Order.countDocuments({}),
    Order.countDocuments({paymentStatus: "pending"}),
    Order.countDocuments({paymentStatus: "paid"}),
    Order.countDocuments({paymentStatus: "canceled"}),

    Order.countDocuments({
      paymentStatus: "paid",
      fulfillmentStatus: {$in: ["created", "processing"]},
    }),
    Order.countDocuments({
      paymentStatus: "paid",
      fulfillmentStatus: "shipped",
    }),
    Order.countDocuments({
      paymentStatus: "paid",
      fulfillmentStatus: "delivered",
    }),
    Order.aggregate([
      {$match: {paymentStatus: "paid"}},
      {$group: {_id: "$currency", sum: {$sum: {$ifNull: ["$amountTotal", 0]}}}},
    ]),

    Order.aggregate([
      {$match: {paymentStatus: "paid", createdAt: {$gte: monthStart}}},
      {$group: {_id: "$currency", sum: {$sum: {$ifNull: ["$amountTotal", 0]}}}},
    ]),
  ]);

  // Jeśli kiedyś będziesz miał multi-currency, to tu można zrobić mapę.
  // Na razie bierzemy pierwszy wynik albo fallback.
  const allTimeRow = revenueAllTimeAgg?.[0];
  const thisMonthRow = revenueThisMonthAgg?.[0];

  const currency = (
    allTimeRow?._id ||
    thisMonthRow?._id ||
    "gbp"
  ).toLowerCase();

  return {
    usersCount,
    products: {
      total: productsTotal,
      active: productsActive,
      hidden: productsHidden,
    },
    orders: {
      total: ordersTotal,
      pending: ordersPending,
      paid: ordersPaid,
      canceled: ordersCanceled,

      toShip: ordersToShip,
      shipped: ordersShipped,
      delivered: ordersDelivered,
    },
    revenue: {
      allTime: Number(allTimeRow?.sum || 0),
      thisMonth: Number(thisMonthRow?.sum || 0),
      currency,
    },
  };
}
