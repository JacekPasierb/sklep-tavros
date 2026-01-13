import type {Session} from "next-auth";

export const getUserLabel = (session: Session | null) => {
  const u = session?.user;
  return u?.name || u?.email || "My account";
};
