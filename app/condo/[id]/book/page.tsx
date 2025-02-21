"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { addDays, isBefore, isAfter, isSameDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useGetCondoById } from "@/lib/api/api";
import Cookies from "js-cookie";

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    data: condo,
    isLoading,
    isError,
    error,
  } = useGetCondoById(params.id as string);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    guests: 1,
    specialRequests: "",
    number: "",
  });
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const user = Cookies.get("user");
  const [userId, setUserId] = useState();

  useEffect(() => {
    if (condo) {
      fetchAvailability();
    }
    if (user) {
      setUserId(JSON.parse(user)._id);
    }
  }, [condo]);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    setFormValues((prev) => ({
      ...prev,
      checkIn: range?.from,
      checkOut: range?.to,
    }));
    console.log(formValues.checkIn + " checkin and out "+formValues.checkOut)
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

  const submitReservation = async (e: React.FormEvent) => {
    const totalDays = getTotalDays(
      formValues.checkIn?.toISOString(),
      formValues.checkOut?.toISOString()
    );
    const price = condo ? totalDays * condo?.price : 0;
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
          checkIn: formValues.checkIn?.toLocaleDateString("en-PH"),
          checkOut: formValues.checkOut?.toLocaleDateString("en-PH"),
          price: price.toString(),
          condoImage: condo?.image,
          number: formValues.number,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your reservation has been submitted successfully",
        });
        fetchAvailability(); // Refresh availability after successful booking
        router.push("/reservations")
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{condo?.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <div>
            <Image
              src={condo?.image || "/placeholder.svg"}
              alt={params.id}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-64"
            />
            <p className="mt-4 text-lg font-semibold">
              ₱{condo?.price.toLocaleString()} / night
            </p>
            <p className="mt-2 text-gray-600">{condo?.description}</p>
          </div>
          <div>
            <form onSubmit={submitReservation} className="space-y-4">
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
                <Label htmlFor="number">Mobile Number</Label>{" "}
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
                  modifiers={{ booked: isDateUnavailable }}
                  modifiersStyles={{
                    booked: {
                      backgroundColor: "#FEE2E2",
                      color: "#EF4444",
                      cursor: "not-allowed",
                      opacity: 0.7,
                    },
                  }}
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
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  placeholder="Any special requests or requirements?"
                  value={formValues.specialRequests}
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit" className="w-full">
                Confirm Booking
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
