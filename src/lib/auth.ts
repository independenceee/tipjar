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

export const config: NextAuthOptions = {
    providers: [
        CredentialProvider({
            name: "credentials",
            credentials: {
                data: { type: "text" },
            },
            async authorize(credentials, req) {
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
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user }: { user: User }) {
            return true;
        },
        async redirect() {
            return "/dashboard";
        },
        async jwt({ user, token }: { user?: User; token: any }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            session.user = token.user;
            return session;
        },
    },
};

export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
    return getServerSession(...args, config);
}
export const GET = NextAuth(config);
export const POST = NextAuth(config);
export const { signOut, signIn } = NextAuth(config);
