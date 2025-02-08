"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Cookies from "js-cookie";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { useGetCondoById } from "@/lib/api/api";
import { Calendar } from "@/components/ui/calendar";
import { addDays, isBefore, isAfter, isSameDay } from "date-fns";
import { toast } from "@/hooks/use-toast";
import type React from "react"; // Added import for React

export default function CondoDetails() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [userId, setUserId] = useState();
  const params = useParams();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    guests: 1,
    specialRequests: "",
    number: "",
  });
  const {
    data: condoData,
    isLoading,
    isError,
    error,
  } = useGetCondoById(params.id as string);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const user = Cookies.get("user");
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    if (condoData) {
      fetchAvailability();
      fetchOwnerName();
    }
    if (user) {
      setUserId(JSON.parse(user)._id);
    }
  }, [condoData, user]);

  const fetchAvailability = async () => {
    const startDate = new Date();
    const endDate = addDays(startDate, 90); // Fetch availability for the next 90 days
    const response = await fetch(
      `/api/availability/${
        params.id
      }?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    if (response.ok) {
      const data = await response.json();
      setBookedDates(data.bookedDates.map((date: string) => new Date(date)));
    } else {
      console.error("Failed to fetch availability");
    }
  };
  const getDayClass = (date: Date) => {
    return isDateUnavailable(date)
      ? "bg-red-200 text-gray-500 cursor-not-allowed"
      : undefined;
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDateSelect = (
    range: { from: Date | undefined; to: Date | undefined } | undefined
  ) => {
    setFormValues((prev) => ({
      ...prev,
      checkIn: range?.from,
      checkOut: range?.to,
    }));
  };

  const isDateUnavailable = (date: Date) => {
    return bookedDates.some((bookedDate) => isSameDay(date, bookedDate));
  };
  const getTotalDays = (
    checkIn: string | undefined,
    checkOut: string | undefined
  ): number => {
    if (!checkIn || !checkOut) return 0;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    return totalDays;
  };
  const fetchOwnerName = async () => {
    if (condoData?.owner) {
      try {
        const response = await fetch(`/api/users/${condoData.owner}`);
        if (response.ok) {
          const userData = await response.json();
          setOwnerName(userData.name);
        } else {
          console.error("Failed to fetch owner name");
        }
      } catch (error) {
        console.error("Error fetching owner name:", error);
      }
    }
  };
  const submitReservation = async (e: React.FormEvent) => {
    const totalDays = getTotalDays(
      formValues.checkIn?.toISOString(),
      formValues.checkOut?.toISOString()
    );
    const price = condoData ? totalDays * condoData?.price : 0;
    e.preventDefault();
    if (!formValues.checkIn || !formValues.checkOut) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/reservation/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          condoId: params.id,
          guests: formValues.guests,
          guestName: formValues.name,
          email: formValues.email,
          secialRequests: formValues.specialRequests,
          checkIn: formValues.checkIn?.toISOString(),
          checkOut: formValues.checkOut?.toISOString(),
          price: price.toString(),
          condoImage: condoData?.image,
          number: formValues.number,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your reservation has been submitted successfully",
        });
        setIsBookingModalOpen(false);
        fetchAvailability(); // Refresh availability after successful booking
      } else {
        throw new Error("Failed to submit reservation");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit reservation. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading)
    return (
      <div>
        {" "}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8 mt-12 justify-center ">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent>
                    {condoData?.images.map((src, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Image
                            src={src || "/placeholder.svg"}
                            alt={`${condoData?.name} - Image ${index + 1}`}
                            width={1200}
                            height={400}
                            className="rounded-lg object-cover w-full h-96"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-4">{condoData?.name}</h1>
                <p className="text-gray-600 mb-4">Hosted by {ownerName}</p>
                <p className="text-xl font-semibold text-amber-500 mb-4">
                  ₱{condoData?.price} / night
                </p>
                <p className="text-gray-700 mb-6">{condoData?.description}</p>
                <h2 className="text-xl font-semibold mb-2">Amenities</h2>
                <ul className="list-disc list-inside mb-6">
                  {condoData?.amenities.map((amenity, index) => (
                    <li key={index} className="text-gray-700">
                      {amenity}
                    </li>
                  ))}
                </ul>
                <Dialog
                  open={isBookingModalOpen}
                  onOpenChange={setIsBookingModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Book Your Stay</DialogTitle>
                      <DialogDescription>
                        Fill out the form below to book your stay at{" "}
                        {condoData?.name}.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => submitReservation(e)}
                    >
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formValues.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formValues.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label>Select Dates</Label>
                        <Calendar
                          mode="range"
                          selected={{
                            from: formValues.checkIn,
                            to: formValues.checkOut,
                          }}
                          onSelect={handleDateSelect}
                          disabled={(date) =>
                            isDateUnavailable(date) ||
                            isBefore(date, new Date()) ||
                            isAfter(date, addDays(new Date(), 90))
                          }
                          className="rounded-md border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="guests">Number of Guests</Label>
                        <Input
                          id="guests"
                          type="number"
                          min="1"
                          value={formValues.guests}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="guests">Mobile Number</Label>
                        <Input
                          id="number"
                          type="text"
                          value={formValues.number}
                          onChange={handleInputChange}
                          required
                          pattern="^09[0-9]{9}$"
                          maxLength={11}
                          placeholder="09XXXXXXXXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialRequests">
                          Special Requests
                        </Label>
                        <Textarea
                          id="specialRequests"
                          placeholder="Any special requests or requirements?"
                          value={formValues.specialRequests}
                          onChange={handleInputChange}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        Confirm Booking
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
