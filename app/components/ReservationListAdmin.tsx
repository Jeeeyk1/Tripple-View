"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useGetReservationByHostId, useGetReservations } from "@/lib/api/api";
import { useEffect, useState } from "react";
import { Reservation, User, UserType } from "@/lib/types";
import { approveOrDeclineReservation } from "@/lib/api/mutation";

enum ReservationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  DECLINED = "declined",
  CANCELLED = "cancelled",
}

interface ResAdminProps {
  userInfo: User;
}

export default function ReservationListAdmin({ userInfo }: ResAdminProps) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const {
    data: reservationHost,
    isLoading: loading,
    error,
  } = useGetReservationByHostId(userInfo?._id);
  const {
    data: reservationsAll,
    isLoading: loadingAll,
    error: err,
    refetch,
  } = useGetReservations();
  const queryClient = useQueryClient();
  const reservations =
    userInfo.userType == UserType.ADMIN ? reservationsAll : reservationHost;
  const { mutate: updateReservation } = useMutation({
    mutationFn: approveOrDeclineReservation,
    onMutate: async ({ id, action }) => {
      await queryClient.cancelQueries({ queryKey: ["getReservations"] });

      const previousReservations = queryClient.getQueryData([
        "getReservations",
      ]);

      queryClient.setQueryData(["getReservations"], (oldData: any) => {
        if (!oldData) return oldData;

        return oldData.map((reservation: any) =>
          reservation.id === id
            ? { ...reservation, status: action }
            : reservation
        );
      });

      return { previousReservations };
    },
    onError: (error, _, context) => {
      if (context?.previousReservations) {
        queryClient.setQueryData(
          ["getReservations"],
          context.previousReservations
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getReservations"] });
      setTimeout(() => {
        window.location.reload();
      }, 700);
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  if (loading || loadingAll)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );

  const filteredReservations = status
    ? reservations?.filter((res) => res.status === status)
    : reservations;

  const startIndex = (currentPage - 1) * pageSize;
  const currentReservations = filteredReservations?.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleApprove = (id: string) => {
    updateReservation({ id, action: "accept" });
    console.log(`Approve reservation with id: ${id}`);
  };

  const handleDecline = (id: string) => {
    updateReservation({ id, action: "decline" });

    console.log(`Decline reservation with id: ${id}`);
  };

  const totalPages = filteredReservations
    ? Math.ceil(filteredReservations?.length / pageSize)
    : 0;

  return (
    <div className="space-y-4 p-5">
      <h2 className="text-2xl font-semibold mb-4 ">
        {status
          ? `${status.charAt(0).toUpperCase() + status.slice(1)} Reservations`
          : "All Reservations"}
      </h2>
      {currentReservations?.map((reservation) => (
        <Card key={reservation._id}>
          <CardHeader>
            <CardTitle>{reservation._id}</CardTitle>
            <CardDescription>
              Reservation for {reservation.guestName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Check-in: {new Date(reservation.checkIn).toLocaleDateString()}
            </p>
            <p>
              Check-out: {new Date(reservation.checkOut).toLocaleDateString()}
            </p>
            <p>Guests: {reservation.guests}</p>
            <p>Mobile Number: {reservation.number}</p>
            <p>Email: {reservation.email}</p>
            <Badge
              className="mt-2"
              variant={
                reservation.status === ReservationStatus.APPROVED ||
                reservation.status === ReservationStatus.PENDING
                  ? "default"
                  : reservation.status === ReservationStatus.DECLINED
                  ? "destructive"
                  : reservation.status === ReservationStatus.CANCELLED
                  ? "secondary"
                  : "outline"
              }
            >
              {reservation.status.charAt(0).toUpperCase() +
                reservation.status.slice(1)}
            </Badge>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {reservation.status === "pending" && (
              <>
                <Button
                  onClick={() => handleApprove(reservation._id)}
                  variant="default"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleDecline(reservation._id)}
                  variant="destructive"
                >
                  Decline
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      ))}
      <div className="flex justify-between mt-4 items-center">
        <div>
          <Button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <div>
          <span>Total Reservations: {filteredReservations?.length}</span>
        </div>
      </div>
    </div>
  );
}
