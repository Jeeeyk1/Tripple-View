'use client'
import ReservationListAdmin from "@/app/components/ReservationListAdmin";
import ReservationList from "../../components/ReservationList";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { User, UserType } from "@/lib/types";
export default function ReservationsPage() {
  const userNull: User = {
    _id: "",
    email: "",
    name: "",
    userType: UserType.USER,
  };
  const userCookie = Cookies.get("user");
  const [userInfo, setUserInfo] = useState<User>(userNull);

  useEffect(() => {
    if (userCookie) {
      console.log("cookie ")
      setUserInfo(JSON.parse(userCookie));
    }
  }, []);
  return (
    <div className="space-y-6 mt-24 p-5">
      <h1 className="text-3xl font-bold">Manage Reservations</h1>
      <ReservationListAdmin userInfo={userInfo} />
    </div>
  );
}
