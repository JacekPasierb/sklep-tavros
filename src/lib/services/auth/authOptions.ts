import type {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from "bcryptjs";
import { connectToDatabase } from "../db/mongodb";
import User from "../../../models/User";




type CredentialsShape = {
  email: string;
  password: string;
};

export const authOptions: NextAuthOptions = {
  session: {strategy: "jwt"},
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        const parsed = credentials as Partial<CredentialsShape> | null;

        const email = parsed?.email?.toLowerCase().trim();
        const password = parsed?.password ?? "";

        if (!email || !password) return null;

        await connectToDatabase();

        const user = await User.findOne({email}).lean<{
          _id: unknown;
          email: string;
          password: string;
          role: "user" | "admin";
          firstName: string;
          lastName: string;
        }>();

        if (!user) return null;

        const ok = await compare(password, user.password);
        if (!ok) return null;

        return {
          id: String(user._id),
          email: user.email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
        token.name = user.name ?? null;
      }
      return token;
    },
    async session({session, token}) {
      session.user.id = token.sub ?? "";
      session.user.email = token.email ?? "";
      session.user.role = token.role ?? "user";
      session.user.name = token.name ?? null;
      return session;
    },
  },
  pages: {
    signIn: "/account/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
