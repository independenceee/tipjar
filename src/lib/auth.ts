/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNil } from "lodash";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { NextAuthOptions, User } from "next-auth";
import NextAuth, { getServerSession } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

interface Credentials {
    wallet: string;
    address: string;
}

/**
 * NextAuth configuration object
 *
 * - Uses `CredentialsProvider` for custom wallet-based authentication.
 * - Parses `credentials.data` JSON string into `{ wallet, address }`.
 * - Stores user info in JWT and session objects.
 */
export const config: NextAuthOptions = {
    providers: [
        CredentialProvider({
            name: "credentials",
            credentials: {
                data: {},
            },
            async authorize(credentials) {
                if (!credentials?.data) {
                    return null;
                }

                let parsed: Credentials;
                try {
                    parsed = JSON.parse(credentials.data as string) as Credentials;
                } catch (error) {
                    console.error("Invalid JSON in credentials.data");
                    return null;
                }

                const { wallet, address } = parsed;

                if (isNil(wallet)) {
                    return null;
                }

                return {
                    id: address,
                    wallet,
                    address,
                };
            },
        }),
    ],

    callbacks: {
        /**
         * Called on sign-in attempt.
         * Always returns `true` to allow login.
         */
        async signIn() {
            return true;
        },

        /**
         * Redirect users after sign-in.
         */
        async redirect() {
            return "/dashboard";
        },

        /**
         * Custom JWT callback.
         * Attaches the `user` object to the token on first login.
         */
        async jwt({ user, token }: { user?: User; token: any }) {
            if (user) {
                token.user = user;
            }
            return token;
        },

        /**
         * Custom session callback.
         * Ensures `session.user` is always populated from token.
         */
        async session({ session, token }: { session: any; token: any }) {
            session.user = token.user;
            return session;
        },
    },
} satisfies NextAuthOptions;

/**
 * Helper function to get server-side session.
 * Works in both `getServerSideProps` and API routes.
 */
export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
    return getServerSession(...args, config);
}

/**
 * API route handlers for Next.js App Router (`GET` and `POST`).
 * These will expose NextAuth under `/api/auth/[...nextauth]`.
 */
export const GET = NextAuth(config);
export const POST = NextAuth(config);

/**
 * Exposes the `signIn` helper from NextAuth,
 * which can be used in client components.
 */
export const { signIn } = NextAuth(config);
