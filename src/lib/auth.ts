import { checkSignature, DataSignature, generateNonce } from "@meshsdk/core";
import { isNil } from "lodash";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { NextAuthOptions, User } from "next-auth"; // Import User để sử dụng
import NextAuth, { getServerSession } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

interface Credentials {
    wallet: string;
}

export const config: NextAuthOptions = {
    providers: [
        CredentialProvider({
            name: "Credentials",
            credentials: {
                data: { type: "text" }, // credentials.data là text (JSON string)
            },
            async authorize(credentials, req) {
                if (!credentials?.data) {
                    return null; // Trả về null thay vì throw, để NextAuth xử lý lỗi
                }

                let parsedData: Credentials;
                try {
                    parsedData = JSON.parse(credentials.data as string) as Credentials;
                } catch (error) {
                    console.error("Invalid JSON in credentials.data");
                    return null;
                }

                const { wallet } = parsedData;

                // Validate các trường bắt buộc
                if (isNil(wallet)) {
                    return null;
                }

                return {
                    id: wallet,
                    wallet,
                };
            },
        }),
    ],
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
