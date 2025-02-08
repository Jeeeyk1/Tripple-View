import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Wifi,
  Dumbbell,
  PocketIcon as Pool,
  MapPin,
  Clock,
  Shield,
  Star,
  Coffee,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/app/components/Navbar";
import Link from "next/link";
import GoogleMapComponent from "./components/GoogleMap";
interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
}
export default function Home() {
  const locations: Location[] = [
    { id: 1, lat: 14.583 , lng: 120.983, name: "Ermita, Manila Triple View Condominium" },
  ];
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Experience Luxury Living at Triple View
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Discover unparalleled comfort and convenience in the heart of
                Metro Manila. Your perfect home away from home awaits.
              </p>
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Link href="/condo">Book Your Stay </Link>
              </Button>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/images/featured.jpg"
                alt="Triple View Condominium"
                width={800}
                height={600}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            Your Premium Address in Metro Manila
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                Triple View is a Class-A, convenient, and affordable provider of
                condominium living in Metro Manila. Our prime locations in
                Taguig, Makati, and Manila offer easy access to major business
                districts, international cuisines, and entertainment hubs.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Just 28km from the International Airport, our condominiums are
                perfect for both business travelers and tourists seeking a
                comfortable stay in the bustling metropolis.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-amber-500 mr-2" /> Fully
                  furnished suites
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-amber-500 mr-2" /> Daily,
                  weekly, and monthly stays available
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-amber-500 mr-2" /> 24/7 security
                  and concierge services
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-amber-500 mr-2" /> Ideal for
                  both short and long-term stays
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative w-full h-72 overflow-hidden rounded-lg">
                <Image
                  src="/images/featured1.jpg"
                  alt="Condo Interior"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="relative w-full h-72 overflow-hidden rounded-lg">
                <Image
                  src="/images/featured2.jpg"
                  alt="Condo Exterior"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="relative w-full h-72 overflow-hidden rounded-lg">
                <Image
                  src="/images/featured3.jpg"
                  alt="Condo Amenities"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="relative w-full h-72 overflow-hidden rounded-lg">
                <Image
                  src="/images/featured5.jpg"
                  alt="Condo View"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="amenities" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            Unmatched Features and Amenities
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <Building2 className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Luxurious Units</h3>
                <p className="text-gray-600">
                  Spacious 49 sqm suite-type rooms with fully furnished
                  bedrooms, living areas, and modern amenities for ultimate
                  comfort.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <MapPin className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Prime Location</h3>
                <p className="text-gray-600">
                  Strategically located near business districts, shopping
                  centers, restaurants, and entertainment venues in Metro
                  Manila.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Flexible Terms</h3>
                <p className="text-gray-600">
                  Choose from daily, weekly, or monthly stays to suit your
                  needs, whether you're on a short trip or an extended stay.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Wifi className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">High-Speed Internet</h3>
                <p className="text-gray-600">
                  Stay connected with complimentary high-speed Wi-Fi available
                  in all units and common areas.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Dumbbell className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Fitness Center</h3>
                <p className="text-gray-600">
                  Maintain your workout routine in our fully-equipped gym with
                  modern exercise equipment.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Pool className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Swimming Pool</h3>
                <p className="text-gray-600">
                  Relax and unwind in our refreshing swimming pool with a
                  stunning view of the city skyline.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">24/7 Security</h3>
                <p className="text-gray-600">
                  Feel safe and secure with round-the-clock security personnel
                  and modern surveillance systems.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Coffee className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Lounge Areas</h3>
                <p className="text-gray-600">
                  Enjoy comfortable common areas perfect for relaxation, work,
                  or socializing with other guests.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Utensils className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Kitchenette</h3>
                <p className="text-gray-600">
                  Each unit features a well-equipped kitchenette for preparing
                  meals and snacks at your convenience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            Affordable Luxury Accommodations
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Daily Rates</h3>
                <p className="text-4xl font-bold text-amber-500 mb-4">
                  ₱1,800 - ₱6,000
                </p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-amber-500 mr-2" /> Fully
                    furnished units
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-amber-500 mr-2" /> Daily
                    housekeeping
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-amber-500 mr-2" /> All
                    amenities included
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-amber-500 mr-2" /> Flexible
                    check-in/out
                  </li>
                </ul>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                  Book Now
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Extended Stays</h3>
                <p className="text-lg text-gray-600 mb-4">
                  Enjoy special rates for weekly and monthly bookings, perfect
                  for long-term stays or business trips.
                </p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-amber-500 mr-2" /> Discounted
                    rates
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-amber-500 mr-2" />{" "}
                    Customizable amenities
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-amber-500 mr-2" /> Dedicated
                    support
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-amber-500 mr-2" /> Flexible
                    lease terms
                  </li>
                </ul>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                  Contact for Rates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-amber-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Experience the Triple View Difference
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Book your stay today and discover why Triple View Condominium is the
            preferred choice for discerning travelers in Metro Manila.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/condo">Book Your Stay Now</Link>
          </Button>
        </div>
      </section>
      <div className="mt-32 mb-32">
        <GoogleMapComponent locations={locations} />
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                Triple View Condominium
              </h3>
              <p className="text-gray-400">Ermita, Manila, Metro Manila</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4" id="contact">Contact</h3>
              <p className="text-gray-400">
                Email: info@tripleview.com
                <br />
                Phone: +63 XXX XXX XXXX
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Locations</h3>
              <ul className="text-gray-400">
                <li>Robinson s Place, Ermita Manila</li>
                <li>Robinsons Place Padre Faura</li>
                <li>Eton Bay park near US Embassy</li>
                <li>Serendra Taguig</li>
                <li>Trion place condominium</li>
                <li>Fort Victoria</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Triple View Condominium. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
