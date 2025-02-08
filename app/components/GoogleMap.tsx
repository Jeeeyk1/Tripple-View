"use client";

import { useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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

export default function GoogleMapComponent({ locations }: MapProps) {
  const [map, setMap] = useState<any>(null);

  const onLoad = useCallback(
    function callback(map: any) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend(
          new window.google.maps.LatLng(location.lat, location.lng)
        );
      });
      map.fitBounds(bounds);
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
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
