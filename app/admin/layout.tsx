"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminSidebar } from "../components/AdminSidebar";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User, UserType } from "@/lib/types";
import { HostSidebar } from "../components/HostSidebar";
const queryClient = new QueryClient();

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfoCookie = Cookies.get("user");
  const [userInfo, setUserInfo] = useState<User>();
  useEffect(() => {
    if (userInfoCookie) {
      setUserInfo(JSON.parse(userInfoCookie));
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-zinc-50">
        {userInfo?.userType !== UserType.ADMIN ? (
          <HostSidebar userInfo={userInfo} />
        ) : (
          <AdminSidebar userInfo={userInfo} />
        )}

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
