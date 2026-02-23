// src/app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Construction Bill Manager",
    description: "Track, manage and export construction bills as PDF",
    manifest: "/manifest.json",
    themeColor: "#f97316",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "BillMgr",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
            </head>
            <body className={inter.className}>
                <ServiceWorkerRegister />
                <AuthProvider>
                    <div className="flex flex-col min-h-dvh">
                        <Navbar />
                        <main className="flex-1 pb-24 md:pb-6 md:pl-64 px-4 py-6 max-w-5xl mx-auto w-full">
                            {children}
                        </main>
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
