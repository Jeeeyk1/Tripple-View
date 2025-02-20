"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { Sidebar } from "./components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "./components/Navbar";
import { useEffect, useState } from "react";
import { User as UserSession } from "@/lib/types";
import { AdminSidebar } from "./components/AdminSidebar";
import Cookies from "js-cookie";
// Create a new instance of QueryClient
const queryClient = new QueryClient();
import { usePathname } from "next/navigation";
import { AuthProvider } from "./provider/AuthContext";

const inter = Inter({ subsets: ["latin"] });
enum UserType {
  USER = "USER",
  HOST = "HOST",
  ADMIN = "ADMIN",
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <AuthProvider>
              <div className="flex h-screen">
                <main className="flex-1 overflow-auto">
                  <div className=" ">
                    {pathname && !pathname.startsWith("/admin") && <Navbar />}

                    {children}
                  </div>
                </main>
              </div>
              <Toaster />
            </AuthProvider>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
