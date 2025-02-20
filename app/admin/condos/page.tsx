"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2, User } from "lucide-react";
import { useAppStore } from "@/lib/store";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useGetUserById, useGetUsers } from "@/lib/api/api";

export default function CondosPage() {
  const { condos, setCondos, deleteCondo } = useAppStore();
  const { data: users, error } = useGetUsers();
  useEffect(() => {
    const fetchCondos = async () => {
      const response = await fetch("/api/condos");
      const data = await response.json();
      setCondos(data);
    };
    fetchCondos();
  }, [setCondos]);

  const handleRemove = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this condo?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/condos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Deleted",
          description: "The condo has been successfully deleted.",
        });
        deleteCondo(id);
      } else {
        toast({
          title: "Deletion Failed",
          description: "Failed to delete the condo. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the condo.",
        variant: "destructive",
      });
      console.error("Error deleting condo:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Condos</h1>
        <Link href="/admin/add-condo">
          <Button>Add New Condo</Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {condos.map((condo) => (
          <Card key={condo._id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={condo.image || "/placeholder.svg"}
                alt={condo.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{condo.name}</CardTitle>
              <CardDescription className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {users?.filter((user) => user._id == condo.owner)[0].name ||
                  "Unknown Owner"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Badge variant="secondary" className="text-lg">
                  ₱{condo.price.toLocaleString()}
                </Badge>
                <div className="space-x-2">
                  <Link href={`/admin/edit-condo/${condo._id}`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(condo._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {condo.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
