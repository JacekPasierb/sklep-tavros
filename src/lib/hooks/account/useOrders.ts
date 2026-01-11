import useSWR from "swr";


import { OrdersResponse } from "@/types/(shop)/account/orders";
import { ordersFetcher } from "../../utils/(shop)/account/ordersFetcher";


export const useOrders=(shouldFetch: boolean) =>{
  return useSWR<OrdersResponse>(
    shouldFetch ? "/api/account/orders" : null,
    ordersFetcher,
    {revalidateOnFocus: false}
  );
}
