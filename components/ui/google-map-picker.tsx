"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface GoogleMapPickerProps {
  value?: { lat: number; lng: number } | null;
  onChange?: (value: { lat: number; lng: number }) => void;
  readOnly?: boolean;
}

const containerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "300px",
  borderRadius: "0.5rem",
};

const defaultCenter = {
  lat: 40.7128, // New York default
  lng: -74.006,
};

export function GoogleMapPicker({
  value,
  onChange,
  readOnly = false,
}: GoogleMapPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(value || defaultCenter);

  // Update marker position when value changes externally
  useEffect(() => {
    if (value) {
      setMarkerPosition(value);
      map?.panTo(value);
    }
  }, [value, map]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new window.google.maps.LatLngBounds();
      // If we have a value, center on it. Otherwise default.
      if (value) {
        bounds.extend(value);
        map.fitBounds(bounds);
        // Adjust zoom after fitting bounds might zoom too far out for single point
        google.maps.event.addListenerOnce(map, "idle", () => {
          if (map.getZoom()! > 15) map.setZoom(15);
        });
      } else {
        map.setCenter(defaultCenter);
        map.setZoom(10);
      }
      setMap(map);
    },
    [value]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (readOnly || !onChange || !e.latLng) return;

      const newPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkerPosition(newPos);
      onChange(newPos);
    },
    [readOnly, onChange]
  );

  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (readOnly || !onChange || !e.latLng) return;
      const newPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkerPosition(newPos);
      onChange(newPos);
    },
    [readOnly, onChange]
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-[300px] bg-muted rounded-md border">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] rounded-md overflow-hidden border">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        <Marker
          position={markerPosition}
          draggable={!readOnly}
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>
    </div>
  );
}
