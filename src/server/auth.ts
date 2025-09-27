import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
import prisma from "@/lib/db";
import { JWT } from "next-auth/jwt";
import { loginAction } from "./actions/auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string;
      email: string;
      role: UserRole;
      image?: string;
      country?: string;
      city?: string;
      postalCode?: string;
      streetAddress?: string;
      phone?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string;
    email: string;
    role: UserRole;
    image?: string;
    country?: string;
    city?: string;
    postalCode?: string;
    streetAddress?: string;
    phone?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const res = await loginAction(credentials);

        if (res.status === 200 && res.user) {
          return res.user;
        } else {
          throw new Error(
            JSON.stringify({
              responseError: res.message,
            })
          );
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  callbacks: {
    jwt: async ({ token }): Promise<JWT> => {
      if (!token.email) return token as JWT;

      const dbUser = await prisma.user.findUnique({
        where: { email: token.email },
      });

      if (!dbUser) {
        return {
          id: token.sub ?? "",
          name: token.name ?? "",
          email: token.email,
          role: "USER",
          image: token.picture ?? "",
          country: "",
          city: "",
          postalCode: "",
          streetAddress: "",
          phone: "",
        };
      }

      return {
        id: dbUser.id,
        name: dbUser.name ?? "",
        email: dbUser.email,
        role: dbUser.role,
        image: dbUser.image ?? "",
        country: dbUser.country ?? "",
        city: dbUser.city ?? "",
        postalCode: dbUser.postalCode ?? "",
        streetAddress: dbUser.streetAddress ?? "",
        phone: dbUser.phone ?? "",
      };
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.country = token.country;
        session.user.city = token.city;
        session.user.postalCode = token.postalCode;
        session.user.streetAddress = token.streetAddress;
        session.user.phone = token.phone;
      }

      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { accounts: true },
        });

        if (existingUser) {
          const hasGoogle = existingUser.accounts.some(
            (acc) => acc.provider === "google"
          );

          if (!hasGoogle) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
                access_token: account.access_token,
                token_type: account.token_type,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
              },
            });
          }
        }
      }

      return true;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
