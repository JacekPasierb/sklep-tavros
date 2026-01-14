// src/app/api/admin/orders/route.ts
import { NextResponse } from "next/server";

import { requireAdmin } from "../../../../lib/auth/requireAdmin";
import { normalizeOrdersQuery } from "../../../../lib/utils/admin/orders/query";
import getAdminOrders from "../../../../lib/services/admin/orders.service";

import type { OrdersSearchParams } from "../../../../types/admin/orders";

export async function GET(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);

  // 1️⃣ bierzemy searchParams jako stringi
  const searchParams: OrdersSearchParams = {
    page: url.searchParams.get("page") ?? undefined,
    q: url.searchParams.get("q") ?? undefined,
    paymentStatus: (url.searchParams.get("paymentStatus") ??
      "") as OrdersSearchParams["paymentStatus"],
    fulfillmentStatus: (url.searchParams.get("fulfillmentStatus") ??
      "") as OrdersSearchParams["fulfillmentStatus"],
  };

  // 2️⃣ normalizacja (jedno źródło prawdy)
  const query = normalizeOrdersQuery(searchParams, { limit: 20 });

  // 3️⃣ serwis (DB + mapper)
  const result = await getAdminOrders(query);

  // result ma typ OrdersResult
  return NextResponse.json(result);
}
