'use client';

import { useEffect, useState } from 'react';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

interface LocalityMapProps {
  name: string;
  center: [string, string]
}

export default function LocalityMap({name, center}: LocalityMapProps) {

  useEffect(() => {
    const map = L.map('map', {
      zoomControl: false,  // Hide zoom controls
      scrollWheelZoom: false,  // Disable scroll zoom
      dragging: false,  // Disable map dragging
      touchZoom: false,  // Disable touch zoom
      doubleClickZoom: false,  // Disable double click zoom
      boxZoom: false,  // Disable box zoom
      keyboard: false,  // Disable keyboard navigation
      attributionControl: false,  // Hide attribution
    }).setView([parseFloat(center[0]), parseFloat(center[1])], 15, {
      animate: true,
      duration: 1.5
    });

    // Custom styled map layer using Stamen Toner Lite
    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '',
      // Note: interactive option removed as it's not a valid TileLayerOptions property
    }).addTo(map);
    // Create a single circle with gradient effect
    const circle = L.circle([parseFloat(center[0]), parseFloat(center[1])], {
      radius: 800,  // Single large circle
      color: 'rgba(255, 59, 48, 0.3)',
      fillColor: 'rgba(255, 59, 48, 0.2)',
      fillOpacity: 0.8,
      weight: 1,
      className: 'gradient-circle'
    }).addTo(map);

    // Add gradient effect using CSS
    const style = document.createElement('style');
    style.textContent = `
      .gradient-circle {
        background: radial-gradient(
          circle,
          rgba(255, 59, 48, 0.2) 0%,
          rgba(255, 59, 48, 0.1) 50%,
          rgba(255, 59, 48, 0) 100%
        );
      }
    `;
    document.head.appendChild(style);

    // Custom marker style
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-pin"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });

    const marker = L.marker([parseFloat(center[0]), parseFloat(center[1])], { icon: customIcon }).addTo(map);
    marker.bindPopup(name).openPopup();

    // Fly to the location with animation
    map.flyTo([parseFloat(center[0]), parseFloat(center[1])], 15, {
      duration: 1.5,
      easeLinearity: 0.25
    });

    return () => {
      map.remove();
    };
  }, [center, name]);

  return (
    <>
      <style jsx>{`
        .custom-marker {
          background: transparent;
        }
        .marker-pin {
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: #000;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -15px 0 0 -15px;
        }
        .marker-pin::after {
          content: '';
          width: 14px;
          height: 14px;
          margin: 8px 0 0 8px;
          background: #fff;
          position: absolute;
          border-radius: 50%;
        }
      `}</style>
      <div id="map" className="h-[400px] rounded-lg" />
    </>
  );
}