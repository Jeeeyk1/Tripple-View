"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserType } from "@/lib/types";

export default function UsersPage() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    userType: UserType.USER,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading)
    return (
      <div>
        {" "}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  if (error) return <div>Error loading users</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNewUser((prev) => ({ ...prev, userType: value as UserType }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement add user functionality here
    console.log("Add user:", newUser);
    setIsDialogOpen(false);
    setNewUser({ name: "", email: "", password: "", userType: UserType.USER });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input
                name="name"
                placeholder="Name"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleInputChange}
                required
              />
              <Select
                onValueChange={handleSelectChange}
                value={newUser.userType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserType.USER}>User</SelectItem>
                  <SelectItem value={UserType.HOST}>Host</SelectItem>
                  <SelectItem value={UserType.ADMIN}>Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Add User</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <Card key={user._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-secondary" />
              </div>
              <div className="space-y-1">
                <CardTitle>{user.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    user.userType === UserType.ADMIN
                      ? "secondary"
                      : user.userType === UserType.HOST
                      ? "default"
                      : "outline"
                  }
                  className="capitalize"
                >
                  {user.userType}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
