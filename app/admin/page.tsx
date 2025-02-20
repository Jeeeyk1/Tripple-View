"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Calendar } from "lucide-react";
import {
  useGetCondos,
  useGetReservationByHostId,
  useGetReservations,
} from "@/lib/api/api";
import { ReservationStatus, User, UserType } from "@/lib/types";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function AdminDashboard() {
  const [userInfo, setUserInfo] = useState<User>({
    _id: "",
    email: "",
    name: "",
    userType: UserType.USER,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { status, data: condos, isFetching } = useGetCondos();

  const { data: reservationsAll, isLoading: loadingAll } = useGetReservations();

  useEffect(() => {
    const userInfoCookie = Cookies.get("user");
    if (userInfoCookie) {
      setUserInfo(JSON.parse(userInfoCookie));
    }
    setIsLoading(false); // Mark as loaded
  }, []);
  const {
    data: reservationHost,
    isLoading: loading,
    error,
  } = useGetReservationByHostId(userInfo._id);
  if (!userInfo) {
    return <div>Error: User not found</div>; // Handle missing user
  }

  if (isLoading) {
    return (
      <div>
        {" "}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    ); // Prevent rendering until userInfo is ready
  }

  const reservations =
    userInfo.userType === UserType.ADMIN ? reservationsAll : reservationHost;
  const pendingReservation = reservations
    ? reservations.filter((r) => r.status === ReservationStatus.PENDING).length
    : 0;
  const totalReservation = reservations?.length;

  // Filter condos by host ID
  const condoHostId = condos?.filter((condo) => condo.owner === userInfo._id);

  // Get the first condo ID (if any)
  const firstCondoId = condoHostId?.[0]?._id;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        {userInfo.userType == UserType.ADMIN ? (
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        ) : (
          <h1 className="text-3xl font-bold tracking-tight">Host Dashboard</h1>
        )}
        <Button variant="secondary">
          <Calendar className="mr-2 h-4 w-4" /> Today
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userInfo.userType == UserType.ADMIN ? (
          <Link href="/admin/condos">
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-secondary">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Condos
                </CardTitle>
                <Home className="h-4 w-4 text-secondary" />
              </CardHeader>
              {isFetching ? (
                <div>Loading...</div>
              ) : (
                <CardContent>
                  <div className="text-2xl font-bold">{condos?.length}</div>
                  <div className="text-xs text-muted-foreground mt-1"></div>
                </CardContent>
              )}
            </Card>
          </Link>
        ) : (
          ""
        )}
        <Link href="/admin/reservations?status=pending">
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-secondary">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Pending Reservations
              </CardTitle>
              <Calendar className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReservation}</div>
              {pendingReservation > 5 ? (
                <div className="text-xs text-muted-foreground mt-1">
                  Requires attention
                </div>
              ) : (
                <div className="text-xs text-muted-foreground mt-1">
                  Maintainable
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/reservations?status=">
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-secondary">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Reservations
              </CardTitle>
              <Calendar className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReservation}</div>
              <div className="text-xs text-muted-foreground mt-1"></div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 items-center align-center">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your condos and reservations
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {userInfo.userType === UserType.ADMIN ? (
              <Link href="/admin/add-condo">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Add New Condo
                </Button>
              </Link>
            ) : (
              <Link href={`/admin/edit-condo/${firstCondoId}`}>
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Edit your Condo
                </Button>
              </Link>
            )}
            <Link href="/admin/reservations">
              <Button className="w-full" variant="outline">
                View All Reservations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
