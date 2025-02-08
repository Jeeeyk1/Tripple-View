"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"

interface AvailabilityCalendarProps {
  condoId: string
  initialAvailableDates: Date[]
}

export default function AvailabilityCalendar({ condoId, initialAvailableDates }: AvailabilityCalendarProps) {
  const [availableDates, setAvailableDates] = useState<Date[]>(initialAvailableDates)

  const handleSelect = (date: Date | undefined):void => {
    if (!date) return

    setAvailableDates((prev) => {
      const dateString = date.toDateString()
      if (prev.some((d) => d.toDateString() === dateString)) {
        return prev.filter((d) => d.toDateString() !== dateString)
      } else {
        return [...prev, date]
      }
    })
  }

  const handleSave = async () => {
    // Here you would send the updated availableDates to your backend
    console.log("Saving available dates for condo", condoId, availableDates)
    alert("Available dates saved successfully!")
  }

  return (
    <div className="space-y-4">
      <Calendar mode="multiple" selected={availableDates} onSelect={()=>{}} className="rounded-md border" />
      <button onClick={handleSave} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Save Available Dates
      </button>
    </div>
  )
}

