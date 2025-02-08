"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"

interface ReservationFormProps {
  condoId: string
}

export default function ReservationForm({ condoId }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  })
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const { addReservation } = useAppStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          condoId,
          guestName: formData.name,
          email: formData.email,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests,
        }),
      })
      if (response.ok) {
        const reservation = await response.json()
        addReservation(reservation)
        setIsAvailable(true)
        alert("Reservation submitted successfully!")
      } else {
        setIsAvailable(false)
      }
    } catch (error) {
      console.error("Error submitting reservation:", error)
      setIsAvailable(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="checkIn" className="block mb-2">
          Check-in Date
        </label>
        <input
          type="date"
          id="checkIn"
          name="checkIn"
          value={formData.checkIn}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="checkOut" className="block mb-2">
          Check-out Date
        </label>
        <input
          type="date"
          id="checkOut"
          name="checkOut"
          value={formData.checkOut}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="guests" className="block mb-2">
          Number of Guests
        </label>
        <input
          type="number"
          id="guests"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          min="1"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Check Availability and Reserve
      </button>
      {isAvailable !== null && (
        <p className={`text-center ${isAvailable ? "text-green-600" : "text-red-600"}`}>
          {isAvailable ? "Dates are available!" : "Sorry, these dates are not available."}
        </p>
      )}
    </form>
  )
}

