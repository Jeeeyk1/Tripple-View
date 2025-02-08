"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"

interface CondoFormProps {
  condoId?: string
}

interface CondoData {
  name: string
  price: number
  description: string
  image: string
  amenities: string[]
  location: {
    lat: number
    lng: number
  }
}

const emptyCondo: CondoData = {
  name: "",
  price: 0,
  description: "",
  image: "",
  amenities: [],
  location: {
    lat: 0,
    lng: 0,
  },
}

export default function CondoForm({ condoId }: CondoFormProps) {
  const [formData, setFormData] = useState<CondoData>(emptyCondo)
  const router = useRouter()
  const { addCondo, updateCondo } = useAppStore()

  useEffect(() => {
    if (condoId) {
      const fetchCondo = async () => {
        const response = await fetch(`/api/condos/${condoId}`)
        const data = await response.json()
        setFormData(data)
      }
      fetchCondo()
    }
  }, [condoId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData((prev) => ({ ...prev, amenities: value.split(",").map((item) => item.trim()) }))
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: Number.parseFloat(value),
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (condoId) {
        const response = await fetch(`/api/condos/${condoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          const updatedCondo = await response.json()
          updateCondo(condoId, updatedCondo)
        }
      } else {
        const response = await fetch("/api/condos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          const newCondo = await response.json()
          addCondo(newCondo)
        }
      }
      router.push("/admin/condos")
    } catch (error) {
      console.error("Error submitting condo:", error)
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
        <label htmlFor="price" className="block mb-2">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
          rows={4}
        />
      </div>
      <div>
        <label htmlFor="image" className="block mb-2">
          Image URL
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="amenities" className="block mb-2">
          Amenities (comma-separated)
        </label>
        <input
          type="text"
          
          name="amenities"
          value={formData.amenities.join(", ")}
          onChange={handleAmenitiesChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="lat" className="block mb-2">
          Latitude
        </label>
        <input
          type="number"
          id="lat"
          name="lat"
          value={formData.location.lat}
          onChange={handleLocationChange}
          required
          step="any"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="lng" className="block mb-2">
          Longitude
        </label>
        <input
          type="number"
          id="lng"
          name="lng"
          value={formData.location.lng}
          onChange={handleLocationChange}
          required
          step="any"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {condoId ? "Update Condo" : "Add Condo"}
      </button>
    </form>
  )
}

