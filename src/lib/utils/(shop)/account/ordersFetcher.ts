import { OrdersResponse } from "@/types/(shop)/account/orders";

export const ordersFetcher = async (url: string): Promise<OrdersResponse> => {
    const res = await fetch(url);
  
    if (!res.ok) {
      throw new Error(`Failed to fetch orders (${res.status})`);
    }
  
    return res.json();
  };