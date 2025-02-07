import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import NextProvider from "./provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Netflix",
    description: "Netflix",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <title>{(metadata.title ?? "Netflix").toString()}</title>
                <meta
                    name="description"
                    content={metadata.description ?? "Netflix"}
                />
                <meta
                    name="keywords"
                    content="movies, streaming, netflix, prime video, hulu, disney, apple tv, netflix, prime video, hulu, disney, apple tv"
                />
                <meta
                    charSet="utf-8"
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
            </head>
            <body>
                <NextProvider>
                    <Header />
                    {children}
                </NextProvider>
            </body>
        </html>
    );
}
