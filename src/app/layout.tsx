import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { auth } from "~/lib/auth";
import Provider from "~/providers";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Hydra TipJar",
    description:
        "HydraTipJar is an open-source dApp for instant, low-fee micropayments and tipping on Cardano using the Hydra Layer 2 protocol. Empower creators and communities with fast, secure, and decentralized payments.",
    keywords: [
        "Cardano",
        "Hydra",
        "Layer 2",
        "dApp",
        "micropayments",
        "tipping",
        "blockchain",
        "open source",
        "crypto",
        "ADA",
        "decentralized",
        "wallet",
        "creator economy",
    ],
    openGraph: {
        title: "HydraTipJar - Decentralized Tipping on Cardano Hydra",
        description:
            "Send and receive tips instantly with negligible fees using Cardano's Hydra Layer 2. HydraTipJar empowers creators and communities with fast, secure, and open-source micropayments.",
        url: "https://tipjar.cardano2vn.io/",
        siteName: "HydraTipJar",
        images: [
            {
                url: "/public/images/logo.png",
                width: 400,
                height: 400,
                alt: "HydraTipJar Logo",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "HydraTipJar - Decentralized Tipping on Cardano Hydra",
        description:
            "Send and receive tips instantly with negligible fees using Cardano's Hydra Layer 2. HydraTipJar empowers creators and communities with fast, secure, and open-source micropayments.",
        images: ["/public/images/logo.png"],
        site: "@cardano2vn",
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Provider session={session}>
                    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
                        <Header />
                        <aside>{children}</aside>
                        <Footer />
                    </main>
                </Provider>
            </body>
        </html>
    );
}
