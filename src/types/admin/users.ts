export type AdminUsersSearchParams = {
    page?: string;
    q?: string;
  };
  
  export type AdminUsersQuery = {
    page: number;
    limit: number;
    q: string;
  };
  
  export type PublicUser = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  };
  
  export type AdminUsersResult = {
    users: PublicUser[];
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  