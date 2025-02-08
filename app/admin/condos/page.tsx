"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"
import { useAppStore } from "@/lib/store"

export default function CondosPage() {
  const { condos, setCondos, deleteCondo } = useAppStore()

  useEffect(() => {
    const fetchCondos = async () => {
      const response = await fetch("/api/condos")
      const data = await response.json()
      setCondos(data)
    }
    fetchCondos()
  }, [setCondos])

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/condos/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        deleteCondo(id)
      } else {
        console.error("Failed to delete condo")
      }
    } catch (error) {
      console.error("Error deleting condo:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Condos</h1>
        <Link href="/admin/add-condo">
          <Button>Add New Condo</Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {condos.map((condo) => (
          <Card key={condo._id}>
            <CardHeader>
              <CardTitle>{condo.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₱{condo.price.toLocaleString()}</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Link href={`/admin/edit-condo/${condo._id}`}>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="destructive" size="icon" onClick={() => handleRemove(condo._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

