"use client";

import { useQuery } from "@tanstack/react-query";
import { getCondos } from "@/lib/api/api";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GoogleMapComponent from "./GoogleMap";
import { Condo } from "@/lib/types";

export default function FeaturedRooms() {
  const {
    data: condos,
    isLoading,
    error,
  } = useQuery({ queryKey: ["condos"], queryFn: () => getCondos() });

  if (isLoading)
    return (
      <div>
        {" "}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  if (error) return <div>Error loading condos</div>;

  return (
    <section className="space-y-8 py-12 sm:py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
        Featured Rooms
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8">
        {condos?.map((room: Condo) => (
          <Card
            key={room._id}
            className="overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl"
          >
            <CardHeader className="p-0">
              <Image
                src={room.image || "/placeholder.svg"}
                alt={room.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">
                {room.name}
              </CardTitle>
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">
                {room.description}
              </p>
              <p className="text-xl sm:text-2xl font-semibold text-indigo-600">
                ₱{room.price.toLocaleString()} / night
              </p>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4">
              <Link href={`/room/${room._id}`} className="w-full">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-12 px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Our Locations
        </h3>
        <div className="rounded-lg overflow-hidden shadow-2xl">
          <GoogleMapComponent
            locations={
              condos?.map((condo) => ({
                id: condo._id,
                name: condo.name,
                ...condo.location,
              })) || []
            }
          />
        </div>
      </div>
    </section>
  );
}
