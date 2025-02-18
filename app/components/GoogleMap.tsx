"use client";

import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";

interface MapProps {
  locations: Array<{
    id: number;
    name: string;
    lat: number;
    lng: number;
  }>;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 0,
  lng: 0,
};
const destination = { lat: 14.583, lng: 120.983 };

export default function GoogleMapComponent({ locations }: MapProps) {
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  const onLoad = useCallback(
    (map: any) => {
      if (locations.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach((location) => {
          bounds.extend(
            new window.google.maps.LatLng(location.lat, location.lng)
          );
        });
        map.fitBounds(bounds);
      }
      setMap(map);
    },
    [locations]
  );

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
        "AIzaSyBH2lbklcZ-XOxupp_YSXjx4bVc2RK5YM4"
      }
      onLoad={() => setMapLoaded(true)}
    >
      {mapLoaded && userLocation && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={14}
          center={userLocation} // Ensure the center is only set once
          options={{
            zoomControl: true, // ✅ Enable zoom buttons
            gestureHandling: "greedy", // ✅ Allow pinch-to-zoom & scroll zoom
            disableDefaultUI: false, // ✅ Keep UI controls visible
            mapTypeControl: true, // ✅ Allow changing map type
          }}
          onLoad={onLoad} // ✅ Keep the map reference
          onUnmount={onUnmount}
        >
          {userLocation && (
            <DirectionsService
              options={{
                origin: userLocation,
                destination,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={(result, status) => {
                if (status === "OK" && result) {
                  setDirections(result);
                } else {
                  console.error("Directions request failed:", status);
                }
              }}
            />
          )}

          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                preserveViewport: true, // ✅ Prevents automatic zoom/centering
                suppressMarkers: false, // Keep markers if needed
              }}
            />
          )}
        </GoogleMap>
      )}
    </LoadScript>
  );
}
