"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, AlertCircle, PhilippinePeso } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User } from "@/lib/types";
import Image from "next/image";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReservationStatus } from "@/enums";

interface Reservation {
  _id: string;

  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  condoImage: string;
  price: number;
}

export default function ReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = Cookies.get("user");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(
    null
  );

  const handleCancel = async () => {
    if (!selectedReservation) return;

    try {
      setLoadingId(selectedReservation);

      // Simulating an API request to cancel reservation
      await axios.put(`/api/reservation/${selectedReservation}`, {
        action: "cancel",
      });

      alert("Reservation cancelled successfully!");
      window.location.reload();
      // Optionally, refresh the reservations list here
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      alert("Failed to cancel the reservation. Please try again.");
    } finally {
      setLoadingId(null);
      setSelectedReservation(null);
    }
  };
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const response = await fetch(`/api/reservation/${user?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        throw new Error("Failed to fetch reservations");
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-11">
      <h1 className="text-3xl font-bold mb-6 text-center">My Reservations</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : reservations.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No reservations found</AlertTitle>
          <AlertDescription>
            You have nt made any reservations yet. Browse our condos and book
            your stay!
          </AlertDescription>
        </Alert>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {reservations.map((reservation) => (
            <motion.div key={reservation._id} variants={item}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <Image
                    src={reservation.condoImage || "/placeholder.svg"}
                    alt={reservation.status}
                    className="w-full h-full object-cover"
                    width={180}
                    height={120}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>test</span>
                    <Badge
                      className="ml-2"
                      variant={getStatusVariant(reservation.status)}
                    >
                      {reservation.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(reservation.checkIn).toLocaleDateString()} -{" "}
                        {new Date(reservation.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {reservation.guests} guests
                      </span>
                    </div>
                    <div className="flex items-center">
                      <PhilippinePeso className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {reservation.price} Total price
                      </span>
                    </div>
                  </div>

                  {/* Cancel Button (Opens Modal) */}
                  {reservation.status !== ReservationStatus.CANCELLED &&
                    reservation.status == ReservationStatus.PENDING && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            onClick={() =>
                              setSelectedReservation(reservation._id)
                            }
                            className="mt-4 w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                          >
                            Cancel Reservation
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Cancel Reservation</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel this reservation?
                            This action cannot be undone.
                          </DialogDescription>
                          <DialogFooter>
                            <Button
                              variant="ghost"
                              onClick={() => setSelectedReservation(null)}
                            >
                              No, Keep it
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleCancel}
                              disabled={loadingId === reservation._id}
                            >
                              {loadingId === reservation._id
                                ? "Cancelling..."
                                : "Yes, Cancel"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}
