import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from "bcryptjs";

import {connectToDatabase} from "../../../../lib/mongodb";
import User from "../../../../models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        await connectToDatabase();

        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password || "";

        if (!email || !password) return null;

        const user = await User.findOne({email});
        if (!user) return null;

        const ok = await compare(password, user.password);
        if (!ok) return null;

        // to, co trafi do tokena/sesji
        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role ?? "user",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({token, user}) {
      // user jest tylko przy logowaniu
      if (user) {
        token.id = (user as {id?: string}).id as string | undefined;
        token.role = (user as {role?: string}).role;
      }
      return token;
    },
    async session({session, token}) {
      if (session.user) {
        (session.user as {id: string; role: string}).id = token.id as string;
        (session.user as {id: string; role: string}).role =
          token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/account/signin", // Twoja strona logowania
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
