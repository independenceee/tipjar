"use client";

import React from "react";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import BlockchainProvider from "./blockchain";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function Provider({ children, session }: { children: React.ReactNode; session: SessionProviderProps["session"] }) {
    const queryClient = new QueryClient();
    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <BlockchainProvider>{children}</BlockchainProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
