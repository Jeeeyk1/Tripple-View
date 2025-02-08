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
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    const updateUserSession = () => {
      const user = Cookies.get("user");
      setUserSession(user ? JSON.parse(user) : null);
    };

    // Load user on mount
    updateUserSession();

    // Listen for login updates
    window.addEventListener("userSessionUpdated", updateUserSession);

    return () => {
      window.removeEventListener("userSessionUpdated", updateUserSession);
    };
  }, []);
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <div className="flex h-screen">
              <main className="flex-1 overflow-auto">
                <div className=" ">
                  {pathname && !pathname.startsWith("/admin") && (
                    <Navbar userSession={userSession} />
                  )}

                  {children}
                </div>
              </main>
            </div>
            <Toaster />
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
