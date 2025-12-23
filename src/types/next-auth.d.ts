import "next-auth";
import "next-auth/jwt";

type UserRole = "user" | "admin";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: UserRole;
    name?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    email?: string;
    name?: string | null;
  }
}
