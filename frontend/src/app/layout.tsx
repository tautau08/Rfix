import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";

const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "Rfix - Issue Tracking System",
    description: "Rfix - Role-based issue tracking and management system",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${poppins.variable} font-sans antialiased`}>
                <AuthProvider>
                    {children}
                    <Toaster position="top-right" richColors closeButton />
                </AuthProvider>
            </body>
        </html>
    );
}
