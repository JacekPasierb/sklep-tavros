export type AdminMetrics = {
  usersCount: number;

  products: {
    total: number;
    active: number;
    hidden: number;
  };

  orders: {
    total: number;
    pending: number;
    paid: number;
    canceled: number;

    toShip: number; 
    shipped: number;
    delivered: number;
  };

  revenue: {
    allTime: number;
    thisMonth: number;
    currency: string; // np. "gbp"
  };
};
