'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  icon?: string;
}

interface LeafletMapProps {
  markers: MarkerData[];
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

function MapUpdater({ center, zoom, markers }: { center: [number, number], zoom: number, markers: MarkerData[] }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const timeout = setTimeout(() => {
      try {
        if (markers.length > 1) {
          const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
          map.fitBounds(bounds, { padding: [40, 40], animate: false });
        } else if (markers.length === 1) {
          map.setView([markers[0].lat, markers[0].lng], 16, { animate: false });
        } else {
          map.setView(center, zoom, { animate: false });
        }
      } catch (error) {
        console.warn("Leaflet map initialization skipped to prevent crash:", error);
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [center, zoom, markers, map]);
  return null;
}

export default function LeafletMap({ markers, center = [-16.500, -68.130], zoom = 13, onMarkerClick, className = "w-full h-full" }: LeafletMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY || '';
  const tileUrl = apiKey 
    ? `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${apiKey}`
    : `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png`;

  // Custom Icon function
  const createCustomIcon = (marker: MarkerData) => {
    const html = `
      <div class="custom-map-marker flex flex-col items-center cursor-pointer group -mt-10">
        <div class="bg-white px-3 py-1.5 rounded-lg shadow-md font-bold text-xs text-[#2D2422] mb-1 whitespace-nowrap transform group-hover:-translate-y-1 transition-transform border border-[#D4AF37] relative z-10">
          ${marker.title} ${marker.subtitle ? `<span class="text-[10px] text-[#D4AF37] ml-1">⭐ ${marker.subtitle}</span>` : ''}
        </div>
        <div class="w-10 h-10 bg-[#D32F2F] rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white group-hover:scale-110 transition-transform text-lg relative z-10">
          ${marker.icon || '📍'}
        </div>
        <div class="w-4 h-1.5 bg-black/20 rounded-[50%] -mt-1 blur-[1px]"></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: '', // Removes default leaflet styling
      iconSize: [40, 60],
      iconAnchor: [20, 60],
    });
  };

  console.log("LeafletMap rendering... center:", center, "markers:", markers.length);
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ width: '100%', height: '100%', zIndex: 0 }}
        attributionControl={false}
      >
        <TileLayer url={tileUrl} />
        {markers.map(marker => (
          <Marker 
            key={marker.id} 
            position={[marker.lat, marker.lng]}
            icon={createCustomIcon(marker)}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(marker.id),
            }}
          />
        ))}
        <MapUpdater center={center} zoom={zoom} markers={markers} />
      </MapContainer>
    </div>
  );
}
