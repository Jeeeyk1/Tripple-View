import Image from "next/image"
import Link from "next/link"
import GoogleMapComponent from "./GoogleMap"

// This is a mock function to simulate searching rooms
// In a real application, you would fetch this data from your backend
const searchRooms = async (query: string) => {
  // Simulating an API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    {
      id: 1,
      name: "First Floor Garden View Room",
      price: 1500,
      image: "https://via.placeholder.com/300x200.png?text=Garden+View+Room",
      description: "Cozy room with a beautiful garden view, perfect for relaxation.",
    },
    {
      id: 2,
      name: "Second Floor Balcony Room",
      price: 1800,
      image: "https://via.placeholder.com/300x200.png?text=Balcony+Room",
      description: "Spacious room with a private balcony and tropical interior design.",
    },
  ].filter((room) => room.name.toLowerCase().includes(query.toLowerCase()))
}

const location = { lat: 7.4478, lng: 125.808 } // Approximate coordinates for Tagum City

export default async function SearchResults({ query }: { query: string }) {
  const results = await searchRooms(query)

  if (results.length === 0) {
    return <p>No results found for {query}</p>
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((room) => (
          <div key={room.id} className="border rounded-lg overflow-hidden shadow-md">
            <Image src={room.image || "/placeholder.svg"} alt={room.name} width={300} height={200} className="w-full" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
              <p className="text-muted-foreground mb-2">{room.description}</p>
              <p className="text-lg font-semibold mb-4">₱{room.price.toLocaleString()} / night</p>
              <Link
                href={`/room/${room.id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Our Location</h2>
        <GoogleMapComponent locations={[{ id: 1, name: "Tripleview Residences", ...location }]} />
      </div>
    </div>
  )
}

