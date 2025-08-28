"use client";

import React from "react";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
// import QueryClientProvider from "./query";
// import ErrorClientProvider from "./error";
// import { Toaster } from "@/components/ui/toaster";
// import BlockchainProvider from "./blockchain";

export default function Provider({ children, session }: { children: React.ReactNode; session: SessionProviderProps["session"] }) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}
