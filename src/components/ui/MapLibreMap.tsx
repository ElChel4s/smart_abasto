'use client';
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  icon?: string;
}

interface MapLibreMapProps {
  markers: MarkerData[];
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

export default function MapLibreMap({ markers, center = [-68.130, -16.500], zoom = 13, onMarkerClick, className = "w-full h-full" }: MapLibreMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const apiKey = process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY;
    const styleUrl = `https://tiles.stadiamaps.com/styles/alidade_smooth.json${apiKey ? `?api_key=${apiKey}` : ''}`;

    // Initialize MapLibre
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl, 
      center: center,
      zoom: zoom,
      attributionControl: false // Ocultamos la atribución por defecto para diseño más limpio, pero se recomienda ponerla en producción
    });

    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when map is loaded or markers change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Limpiar marcadores anteriores (idealmente llevaríamos un registro de los marcadores DOM y los eliminaríamos, pero por simplicidad de este componente, asumimos que no cambian a menudo, o recargamos)
    const currentMarkers = document.querySelectorAll('.custom-map-marker');
    currentMarkers.forEach(m => m.remove());

    markers.forEach((marker) => {
      // Crear elemento DOM personalizado para el marcador
      const el = document.createElement('div');
      el.className = 'custom-map-marker flex flex-col items-center cursor-pointer group';
      
      el.innerHTML = `
        <div class="bg-white px-3 py-1.5 rounded-lg shadow-md font-bold text-xs text-[#2D2422] mb-1 whitespace-nowrap transform group-hover:-translate-y-1 transition-transform border border-[#D4AF37] relative z-10">
          ${marker.title} ${marker.subtitle ? `<span class="text-[10px] text-[#D4AF37] ml-1">⭐ ${marker.subtitle}</span>` : ''}
        </div>
        <div class="w-10 h-10 bg-[#D32F2F] rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white group-hover:scale-110 transition-transform text-lg relative z-10">
          ${marker.icon || '📍'}
        </div>
        <div class="w-4 h-1.5 bg-black/20 rounded-[50%] -mt-1 blur-[1px]"></div>
      `;

      el.addEventListener('click', () => {
        if (onMarkerClick) onMarkerClick(marker.id);
      });

      // Añadir marcador al mapa
      new maplibregl.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map.current!);
    });

    // Fit bounds si hay más de un marcador y no está centrado fijo
    if (markers.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      markers.forEach(m => bounds.extend([m.lng, m.lat]));
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 15 });
    } else if (markers.length === 1) {
      map.current.flyTo({ center: [markers[0].lng, markers[0].lat], zoom: 16 });
    }

  }, [markers, mapLoaded, onMarkerClick]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-inherit" style={{ borderRadius: 'inherit' }} />
    </div>
  );
}
