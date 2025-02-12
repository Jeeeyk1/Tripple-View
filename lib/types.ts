export interface User {
  _id: string;
  name: string;
  email: string;
  userType: UserType;
}
export enum ReservationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  DECLINED = "declined",
  CANCELLED = "cancelled",
}
export enum UserType {
  USER = "USER",
  HOST = "HOST",
  ADMIN = "ADMIN",
}
export interface CondoById {
  images: string[];
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  amenities: string[];
  isAvailable: boolean;
  location: {
    lat: number;
    lng: number;
  };
  owner: {
    _id:string,
    name:string
  }; // This will be the User _id
}
export interface Condo {
  images: string[];
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  amenities: string[];
  isAvailable: boolean;
  location: {
    lat: number;
    lng: number;
  };
  owner: string; // This will be the User _id
}

export interface Reservation {
  _id: string;
  condoId: string;
  userId: string;
  guestName: string;
  email: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: ReservationStatus;
  number: string;
}
