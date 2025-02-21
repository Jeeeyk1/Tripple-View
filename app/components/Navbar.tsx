"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAuth } from "../provider/AuthContext";
import { UserType } from "@/lib/types";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${sectionId}`); // Ensures it works even on different pages
    }
  };
  const logoutHandler = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "GET",
    });

    if (response.ok) {
      logout();
      router.push("/");
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.jpg"
                alt="Triple View Condominium Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="font-bold text-xl hidden sm:inline-block">
                Triple View
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-amber-500 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/condo"
              className="text-sm font-medium hover:text-amber-500 transition-colors"
            >
              Book Your Stay
            </Link>
            <Link
              href="#amenities"
              className="text-sm font-medium hover:text-amber-500 transition-colors"
              onClick={(e) => handleScroll(e, "amenities")}
           >
              Amenities
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium hover:text-amber-500 transition-colors"
              onClick={(e) => handleScroll(e, "contact")}

           >
              Contact
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user._id}`}>Profile</Link>
                  </DropdownMenuItem>
                  {user?.userType == UserType.USER && (
                    <DropdownMenuItem asChild>
                      <Link href="/reservations">My Reservations</Link>
                    </DropdownMenuItem>
                  )}
                  {user?.userType == UserType.ADMIN && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {user?.userType == UserType.HOST && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Host Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Link href="/login">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-4">
                <Link href="/" className="text-sm font-medium">
                  Home
                </Link>
                <Link href="/condo" className="text-sm font-medium">
                  Book Your Stay
                </Link>
                <Link href="#amenities" className="text-sm font-medium">
                  Amenities
                </Link>
                <Link href="#contact" className="text-sm font-medium">
                  Contact
                </Link>
                {user?.userType == UserType.USER && (
                  <DropdownMenuItem asChild>
                    <Link href="/reservations">My Reservations</Link>
                  </DropdownMenuItem>
                )}
                {user?.userType != UserType.ADMIN && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {user ? (
                  <>
                    <Link
                      href={`/profile/${user._id}`}
                      className="text-sm font-medium"
                    >
                      Profile
                    </Link>
                    <Button variant="outline" onClick={logoutHandler}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                      <Link href="/login">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
