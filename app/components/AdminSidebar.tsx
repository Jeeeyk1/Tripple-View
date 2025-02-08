"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Cookies from "js-cookie";

import {
  LayoutDashboard,
  Home,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";
interface AdminSidebarProps {
  userInfo: User;
}
 
export function AdminSidebar({ userInfo }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarNavItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Condos",
      href: "/admin/condos",
      icon: Home,
    },
    {
      title: "Reservations",
      href: "/admin/reservations",
      icon: CalendarDays,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Settings",
      href: `/profile/${userInfo._id}`,
      icon: Settings,
    },
  ];
  const logoutHandler = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "GET",
    });
    if (response.ok) {
      Cookies.remove("user");
      Cookies.remove("token");

      window.location.reload();
      router.push("/");
    }
  };
  return (
    <nav
      className={cn(
        "flex flex-col h-screen bg-zinc-900 text-zinc-100 border-r border-zinc-800 transition-all duration-300",
        isExpanded ? "w-72" : "w-16"
      )}
    >
      <div className="p-4 flex flex-col items-center space-y-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-end"
        >
          <Menu className="h-6 w-6" />
        </Button>
        {isExpanded && (
          <>
            <Image
              src="/images/logo.jpg"
              alt="TripleView Logo"
              width={180}
              height={120}
              className="w-auto h-auto"
            />
            <Separator className="bg-zinc-800" />
          </>
        )}
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2">
          {sidebarNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 px-2",
                  pathname === item.href
                    ? "bg-zinc-800 text-secondary hover:bg-zinc-800 hover:text-secondary"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
                  isExpanded ? "h-12" : "h-12 w-12"
                )}
              >
                <item.icon className="h-5 w-5" />
                {isExpanded && (
                  <span className="font-medium">{item.title}</span>
                )}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-zinc-800">
        <Button
          onClick={logoutHandler}
          variant="ghost"
          className={cn(
            "w-full gap-2 text-zinc-400 hover:text-zinc-1000",
            isExpanded ? "" : "px-0 h-12 w-12"
          )}
        >
          <LogOut className="h-4 w-4" />
          {isExpanded && "Logout"}
        </Button>
      </div>
    </nav>
  );
}
