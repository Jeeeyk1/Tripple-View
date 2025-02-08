"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Home, Search, LogIn, Menu } from "lucide-react"

const sidebarNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Search",
    href: "/search",
    icon: Search,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  // Don't show sidebar on admin pages
  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <nav
      className={cn(
        "flex flex-col h-screen bg-zinc-900 text-zinc-100 border-r border-zinc-800 transition-all duration-300",
        isExpanded ? "w-72" : "w-16",
      )}
    >
      <div className="p-4 flex flex-col items-center space-y-4">
        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="self-end">
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
                  isExpanded ? "h-12" : "h-12 w-12",
                )}
              >
                <item.icon className="h-5 w-5" />
                {isExpanded && <span className="font-medium">{item.title}</span>}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-zinc-800">
        <Link href="/login">
          <Button variant="secondary" className={cn("w-full gap-2", isExpanded ? "" : "px-2 h-10 w-10 mr-6")}>
            <LogIn className="h-4 w-4" />
            {isExpanded && "Login"}
          </Button>
        </Link>
      </div>
    </nav>
  )
}

