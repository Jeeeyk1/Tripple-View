import type { Condo, Reservation, User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const API_URL = "/api";

export function useGetReservationByHostId(hostId: string) {
  return useQuery<Reservation[]>({
    queryKey: ["getResHostId", hostId], // Include hostId in the key for caching
    queryFn: () => getReservationHostId(hostId),
    enabled: !!hostId, // Only run query if hostId is available
  });
}

export const useGetUserById = (id: string) => {
  return useQuery<User>({
    queryKey: ["getUserById"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/users/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch condo");
      }
      return response.json();
    },
  });
};
export async function getCondos(): Promise<Condo[]> {
  const response = await fetch(`${API_URL}/condos`);
  if (!response.ok) {
    throw new Error("Failed to fetch condos");
  }
  return response.json();
}
export const useGetUsers = () => {
  return useQuery({ queryKey: ["getUsers"], queryFn: getUsers });
};
export const useGetCondos = () => {
  return useQuery({ queryKey: ["getCondos"], queryFn: getCondos });
};
export const useGetReservations = () => {
  return useQuery({ queryKey: ["getReservations"], queryFn: getReservations });
};

export const useGetSession = () => {
  return useQuery({ queryKey: ["getSession"], queryFn: getSession });
};
export const useGetCondoById = (condoId: string) => {
  return useQuery({
    queryKey: ["geCondoById"],
    queryFn: () => {
      return getCondoById(condoId);
    },
  });
};
export const useGetReservationById = (userId: string | null) => {
  return useQuery({
    queryKey: ["getReservationUser"],
    queryFn: () => {
      getReservationUser(userId);
    },
  });
};

async function getCondoById(id: string): Promise<Condo> {
  const response = await fetch(`${API_URL}/condos/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch condo");
  }
  return response.json();
}
async function getUseryId(id: string): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch condo");
  }
  return response.json();
}
async function getReservations(): Promise<Reservation[]> {
  console.log("Testing callign reservation");
  const response = await fetch(`${API_URL}/reservation`);
  if (!response.ok) {
    console.log("not ok");
    throw new Error("Failed to fetch reservations");
  }
  return response.json();
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

async function getReservationUser(userId: string | null): Promise<User[]> {
  const response = await fetch(
    `${API_URL}/reservation/6799ac7cc92df9e74ffb51c0`
  );
  if (!response.ok) {
    console.log(userId + " userid");

    throw new Error("Failed to fetch users");
  }
  return response.json();
}
async function getReservationHostId(
  hostId: string | null
): Promise<Reservation[]> {
  const response = await fetch(`${API_URL}/reservation/find-by-host`, {
    method: "POST",
    body: JSON.stringify({ hostId }),
  });
  if (!response.ok) {
    console.log(hostId + " userid");

    throw new Error("Failed to fetch users");
  }
  return response.json();
}
async function getSession() {
  const response = await fetch(`${API_URL}/auth/session`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}
