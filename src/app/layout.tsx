"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import { PrimeReactProvider } from "primereact/api";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("./components/navbar/navbar"));

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrimeReactProvider>
          <AuthContextProvider>
            <Navbar />
            {children}
          </AuthContextProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
