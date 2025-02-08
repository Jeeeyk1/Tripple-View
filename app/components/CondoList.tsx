"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Condo {
  id: string
  name: string
  price: number
}

const fetchCondos = async (): Promise<Condo[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    { id: "1", name: "Luxury Beachfront Suite", price: 250000 },
    { id: "2", name: "Skyline Penthouse", price: 350000 },
    { id: "3", name: "Downtown Loft", price: 200000 },
  ]
}

export default function CondoList() {
  const [condos, setCondos] = useState<Condo[]>([])

  useEffect(() => {
    fetchCondos().then(setCondos)
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Condos</h2>
      <ul className="space-y-4">
        {condos.map((condo) => (
          <li key={condo.id} className="flex items-center justify-between bg-white p-4 rounded shadow">
            <div>
              <h3 className="font-semibold">{condo.name}</h3>
              <p className="text-gray-600">${condo.price.toLocaleString()}</p>
            </div>
            <div className="space-x-2">
              <Link
                href={`/admin/edit-condo/${condo.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </Link>
              <Link
                href={`/admin/manage-availability/${condo.id}`}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Manage Availability
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

