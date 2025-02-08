"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Reservation {
  _id: string;
  condoId: string;
  condoName: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "pending" | "approved" | "active" | "completed" | "declined";
}

// This is a mock function to fetch reservations
// In a real application, you would fetch this data from your backend

interface ReservationListProps {
  reservations: Reservation[] | null;
}
export default function ReservationList({
  reservations,
}: ReservationListProps) {
  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <h1 className="text-2xl font-bold mb-4">My Reservations</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reservations?.map((reservation) => (
          <Card key={reservation._id}>
            <CardHeader>
              <CardTitle>Reservation for Condo {reservation.condoId}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Check-in: {new Date(reservation.checkIn).toLocaleDateString()}
              </p>
              <p>
                Check-out: {new Date(reservation.checkOut).toLocaleDateString()}
              </p>
              <p>Guests: {reservation.guests}</p>
              <Badge className="mt-2">{reservation.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
