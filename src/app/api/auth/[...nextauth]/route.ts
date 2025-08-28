import NextAuth from "next-auth";
import { config } from "~/lib/auth";

export const POST = NextAuth(config);
export const GET = NextAuth(config);
