"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "../components/Navbar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getCondos, useGetCondos } from "@/lib/api/api";
import { useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";

export default function BookPage() {
  const { status, data: condos, error: err, isFetching } = useGetCondos();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const paginatedCondos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return condos?.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [condos, currentPage]);

  const totalPages = condos ? Math.ceil(condos.length / ITEMS_PER_PAGE) : 0;
  return (
    <>
      {isFetching ? (
        <div className="flex justify-center items-center h-64 mt-10">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <main className="container mx-auto px-4 pt-24 pb-12">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl font-bold text-center mb-8">
                Available Units
              </h1>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Choose from our selection of premium condominium units. All
                units are fully furnished and come with complete amenities for
                your comfort.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {paginatedCondos?.map((condo) => (
                  <Card key={condo._id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative h-[200px]">
                        <Image
                          src={condo.image || "/placeholder.svg"}
                          alt={condo.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <CardTitle className="mb-2">{condo.name}</CardTitle>
                          <p className="text-sm text-gray-500">Makati City</p>
                        </div>
                        <Badge
                          variant={
                            condo && condo.isAvailable
                              ? "success"
                              : "destructive"
                          }
                        >
                          {condo.isAvailable ? "Available" : "Booked"}
                        </Badge>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-2xl font-bold text-amber-500">
                            ₱{condo.price.toLocaleString()}/night
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {condo.amenities.map((amenity) => (
                            <Badge key={amenity} variant="secondary">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                        disabled={!condo.isAvailable}
                        asChild
                      >
                        <Link href={`/condo/${condo._id}`}>
                          {condo.isAvailable ? "View Details" : "Not Available"}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
              aria-disabled
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((old) => Math.min(old + 1, totalPages))
              }
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
