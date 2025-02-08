import { create } from "zustand"
import type { Condo, Reservation, User } from "@/lib/types"

interface AppState {
  condos: Condo[]
  reservations: Reservation[]
  users: User[]
  setCondos: (condos: Condo[]) => void
  setReservations: (reservations: Reservation[]) => void
  setUsers: (users: User[]) => void
  addCondo: (condo: Condo) => void
  updateCondo: (id: string, condo: Condo) => void
  deleteCondo: (id: string) => void
  addReservation: (reservation: Reservation) => void
  updateReservation: (id: string, reservation: Reservation) => void
  deleteReservation: (id: string) => void
  addUser: (user: User) => void
  updateUser: (id: string, user: User) => void
  deleteUser: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  condos: [],
  reservations: [],
  users: [],
  setCondos: (condos) => set({ condos }),
  setReservations: (reservations) => set({ reservations }),
  setUsers: (users) => set({ users }),
  addCondo: (condo) => set((state) => ({ condos: [...state.condos, condo] })),
  updateCondo: (id, condo) =>
    set((state) => ({
      condos: state.condos.map((c) => (c._id === id ? { ...c, ...condo } : c)),
    })),
  deleteCondo: (id) =>
    set((state) => ({
      condos: state.condos.filter((c) => c._id !== id),
    })),
  addReservation: (reservation) => set((state) => ({ reservations: [...state.reservations, reservation] })),
  updateReservation: (id, reservation) =>
    set((state) => ({
      reservations: state.reservations.map((r) => (r._id === id ? { ...r, ...reservation } : r)),
    })),
  deleteReservation: (id) =>
    set((state) => ({
      reservations: state.reservations.filter((r) => r._id !== id),
    })),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (id, user) =>
    set((state) => ({
      users: state.users.map((u) => (u._id === id ? { ...u, ...user } : u)),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u._id !== id),
    })),
}))

