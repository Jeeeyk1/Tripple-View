"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { useAuth } from "../provider/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { UserType } from "@/lib/types";
import { User } from "../provider/AuthContext";

export default function AuthPage() {
  const { login } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          action: "login",
        }),
      });

      if (response.ok) {
        toast({
          title: "Login successful",
          description: "You have been logged in successfully.",
        });
        const data = await response.json();
        const userData: User = {
          _id: data.user._id,
          email: data.user.email,
          name: data.user.name,
          userType: data.user.userType,
        };
        login(userData);
        Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
        Cookies.set("token", JSON.stringify(data.token), {
          expires: 1,
        });

        window.dispatchEvent(new Event("userSessionUpdated"));
        if (
          data.user.userType == UserType.ADMIN ||
          data.user.userType == UserType.HOST
        ) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        const data = await response.json();
        toast({
          title: "Login failed",
          description: data.message || "An error occurred during login.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    }
  };
  const validatePassword = (value: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    if (value.length < minLength) {
      setError("Password must be at least 8 characters long.");
    } else if (!hasUpperCase) {
      setError("Password must contain at least one uppercase letter.");
    } else if (!hasLowerCase) {
      setError("Password must contain at least one lowercase letter.");
    } else if (!hasNumber) {
      setError("Password must contain at least one number.");
    } else if (!hasSpecialChar) {
      setError("Password must contain at least one special character.");
    } else {
      setError(""); // No error if all conditions are met
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          name: fullName,
          userType: UserType.USER,
        }),
      });

      if (response.ok) {
        toast({
          title: "Registration successful",
          description:
            "Your account has been created successfully. Please log in.",
        });
        router.push("/login");
        window.location.reload();
      } else {
        const data = await response.json();
        toast({
          title: "Registration failed",
          description: data.message || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logo.jpg"
              alt="TripleView Logo"
              width={180}
              height={120}
              className="w-auto h-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Tripleview Residences
          </CardTitle>
          <CardDescription className="text-center">
            Login or create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="login-email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Log in
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="login-email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <Input
                    id="login-email"
                    type="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="register-email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="register-password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Input
                    type="password"
                    id="password"
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                  />
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="register-confirm-password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
