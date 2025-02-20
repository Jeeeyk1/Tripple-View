"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { UserType, type CondoById, type User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useGetCondoById, useGetUsers } from "@/lib/api/api";
import Image from "next/image";
import { useAuth } from "../provider/AuthContext";

interface CondoFormProps {
  condoId: string;
}

const emptyCondo: Partial<CondoById> = {
  name: "",
  price: 0,
  description: "",
  image: "/placeholder.svg",
  amenities: [],
  images: [],
  owner: { _id: "", name: "" },
};

export default function CondoForm({ condoId }: CondoFormProps) {
  const { user } = useAuth();
  const [hosts, setHosts] = useState<User[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { data: users, isLoading } = useGetUsers();
  const { data: condoSingle } = useGetCondoById(condoId);
  const router = useRouter();
  const { addCondo, updateCondo } = useAppStore();
  const { data: condo } = useGetCondoById(condoId);
  const [formData, setFormData] = useState<Partial<CondoById>>(
    condo ? condo : emptyCondo
  );

  const uploadImage = async () => {
    if (!imageFile) return null;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  const handleMultipleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (files.length > 0) {
      setImageFiles(files);

      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await fetch("/api/users/findHost?role=HOST");
        if (response.ok) {
          const data = await response.json();
          setHosts(data);
        } else {
          console.error("Failed to fetch hosts");
        }
      } catch (error) {
        console.error("Error fetching hosts:", error);
      }
    };

    fetchHosts();

    if (condoId) {
      const fetchCondo = async () => {
        const response = await fetch(`/api/condos/${condoId}`);
        const data = await response.json();
        console.log(JSON.stringify(data.owner.name));
        setFormData(data);
      };
      fetchCondo().then((res) => {
        console.log(formData);
      });
    }
  }, [condoId]);
  if (isLoading) {
    return (
      <div>
        {" "}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleOwnerChange = (name: string, id?: string) => {
    if (id)
      setFormData((prev) => ({
        ...prev,
        owner: { _id: id, name: name },
      }));
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;
      let imageUrls = formData.images || [];
      if (imageFiles.length > 0) {
        const uploadedUrls = await uploadImages();
        if (uploadedUrls.length > 0) {
          imageUrls = uploadedUrls;
        } else {
          console.error("Image upload failed");
          return;
        }
      }
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          console.error("Image upload failed");
          return;
        }
      }

      const updatedFormData = {
        ...formData,
        image: imageUrl,
        images: imageUrls,
      };
      console.log("Submitting data:", updatedFormData); // Debugging
      console.log("Sending request to /api/condos");
      const url = condoId ? `/api/condos/${condoId}` : "/api/condos";
      const method = condoId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedCondo = await response.json();
        if (condoId) {
          updateCondo(condoId, updatedCondo);
          toast({
            title: "Success",
            description: "Condo updated successfully",
          });
        } else {
          addCondo(updatedCondo);
          toast({ title: "Success", description: "Condo added successfully" });
        }
        router.push("/admin");
      } else {
        throw new Error("Failed to submit condo");
      }
    } catch (error) {
      console.error("Error submitting condo:", error);
      toast({
        title: "Error",
        description: "Failed to submit condo",
        variant: "destructive",
      });
    }
  };
  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Image upload failed");

        const data = await response.json();
        uploadedUrls.push(data.imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
        return [];
      }
    }

    setIsUploading(false);
    return uploadedUrls;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{condoId ? "Edit Condo" : "Add New Condo"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (per night)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {formData.image && !imagePreview && (
              <div className="mt-2">
                <Image
                  src={formData.image ?? "/placeholder.svg"}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>
            )}
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview ?? formData.image ?? "/placeholder.svg"}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="images">Display Images</Label>
            <Input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple // Allow multiple image selection
              onChange={handleMultipleImageChange}
            />
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {imagePreviews.map((preview, index) => (
                  <Image
                    key={index}
                    src={preview}
                    alt={`Preview ${index}`}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                ))}
              </div>
            )}
            {imagePreviews.length == 0 &&
              formData.images &&
              formData.images?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.images.map((preview, index) => (
                    <Image
                      key={index}
                      src={preview}
                      alt={`Preview ${index}`}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  ))}
                </div>
              )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities (comma-separated)</Label>
            <Input
              id="amenities"
              name="amenities"
              value={formData.amenities?.join(", ")}
              onChange={handleAmenitiesChange}
            />
          </div>
          {user?.userType == UserType.ADMIN && (
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <div className="relative overflow-hidden">
              <Select
                name="owner"
                value={formData.owner?._id} // ✅ Correct: Use the owner's _id
                onValueChange={(value) => {
                  const selectedHost = hosts.find((host) => host._id === value);
                  if (selectedHost) {
                    handleOwnerChange(selectedHost.name, selectedHost._id);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an owner" />
                </SelectTrigger>
                
                  {" "}
                  <SelectContent >
                    {hosts.map((host) => (
                      <SelectItem key={host._id} value={host._id}>
                        {host.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
             
              </Select>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading
              ? "Uploading..."
              : condoId
              ? "Update Condo"
              : "Add Condo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
