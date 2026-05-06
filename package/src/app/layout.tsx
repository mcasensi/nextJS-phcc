import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/Layout/Header";
import { ThemeProvider } from "next-themes";
import Footer from "./components/Layout/Footer";
import ScrollToTop from "./components/ScrollToTop";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Potters House Christian Church",
    description:
        "The Potters House Christian Church (PHCC) is a vibrant community of faith dedicated to worship, discipleship, and outreach. Join us in our mission to transform lives through the love of Christ.",
    icons: {
        icon: "/images/logo/logo.png",
        shortcut: "/images/logo/logo.png",
        apple: "/images/logo/logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${dmSans.variable} antialiased dark:bg-darkmode`}>
                <ThemeProvider
                    attribute="class"
                    enableSystem={false}
                    defaultTheme="light"
                >
                    <Header />
                    {children}
                    <Footer />
                    <ScrollToTop />
                </ThemeProvider>
            </body>
        </html>
    );
}
