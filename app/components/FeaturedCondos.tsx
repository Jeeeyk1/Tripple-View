import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import GoogleMapComponent from "./GoogleMap"

const featuredCondos = [
  {
    id: 1,
    name: "Luxury Beachfront Suite",
    price: 250000,
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    lat: 25.7617,
    lng: -80.1918,
  },
  {
    id: 2,
    name: "Skyline Penthouse",
    price: 350000,
    image:
      "https://images.unsplash.com/photo-1622866306950-81d17097d458?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    lat: 25.7616,
    lng: -80.192,
  },
  {
    id: 3,
    name: "Downtown Loft",
    price: 200000,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    lat: 25.7615,
    lng: -80.1919,
  },
]

export default function FeaturedCondos() {
  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-semibold text-center">Featured Condos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredCondos.map((condo) => (
          <Card key={condo.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <Image
                src={condo.image || "/placeholder.svg"}
                alt={condo.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2">{condo.name}</CardTitle>
              <p className="text-muted-foreground mb-4">${condo.price.toLocaleString()}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/condo/${condo.id}`} className="w-full">
                <Button className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Condo Locations</h3>
        <GoogleMapComponent locations={featuredCondos} />
      </div>
    </section>
  )
}

