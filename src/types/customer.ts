// src/types/customer.ts
export type CustomerAddress = {
    street?: string | null;
    city?: string | null;
    postalCode?: string | null;
    country?: string | null;
  };
  
  export type Customer = {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: CustomerAddress | null;
  };
  