import useSWR from "swr";
import type {OrdersResponse} from "../../types/order";
import {ordersFetcher} from "../utils/orders";

export function useOrders(shouldFetch: boolean) {
  return useSWR<OrdersResponse>(
    shouldFetch ? "/api/account/orders" : null,
    ordersFetcher,
    {revalidateOnFocus: false}
  );
}
