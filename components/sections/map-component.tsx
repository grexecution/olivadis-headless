'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'

// Pteleos, Greece coordinates
const PTELEOS_COORDINATES: [number, number] = [39.0833, 22.6167]

// Custom Olivadis marker - prominent animated dot
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
      <div style="
        width: 24px;
        height: 24px;
        background: #3B6912;
        border: 4px solid #F2E9DB;
        border-radius: 50%;
        box-shadow: 0 0 0 0 rgba(59, 105, 18, 0.7);
        animation: pulse 2s infinite;
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(59, 105, 18, 0.7);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 0 20px rgba(59, 105, 18, 0);
          transform: scale(1.1);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(59, 105, 18, 0);
          transform: scale(1);
        }
      }
    </style>
  `,
  iconSize: [60, 60],
  iconAnchor: [30, 30],
  popupAnchor: [0, -20],
})

function MapContent() {
  const markerRef = useRef<L.Marker>(null)

  useEffect(() => {
    // Open popup on mount
    if (markerRef.current) {
      markerRef.current.openPopup()
    }
  }, [])

  return (
    <>
      {/* CartoDB Positron - clean light style */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <Marker position={PTELEOS_COORDINATES} icon={customIcon} ref={markerRef}>
        <Popup className="custom-popup" closeButton={false} autoClose={false} closeOnClick={false}>
          <div style={{
            padding: '8px',
            fontFamily: 'Lora, serif',
            color: '#1C4220',
            minWidth: '140px'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '4px',
              color: '#3B6912',
              textAlign: 'center'
            }}>
              🫒 Olivadis
            </h3>
            <p style={{
              fontSize: '11px',
              marginBottom: '2px',
              marginTop: '0px',
              lineHeight: '1.3',
              color: '#0B180C',
              textAlign: 'center'
            }}>
              Pteleos, Griechenland
            </p>
          </div>
        </Popup>
      </Marker>

      <style jsx global>{`
        .leaflet-container {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background: #F2E9DB !important;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(28, 66, 32, 0.2);
          border: 2px solid #3B6912;
          background: #FCFBF7;
        }

        .leaflet-popup-tip {
          display: none !important;
        }

        .leaflet-popup-content {
          margin: 0 !important;
        }

        .leaflet-control-attribution {
          background: #F2E9DB !important;
          color: #1C4220 !important;
          font-size: 9px !important;
          padding: 2px 5px !important;
          border-radius: 4px !important;
          border: 1px solid #3B6912 !important;
        }

        .leaflet-control-attribution a {
          color: #3B6912 !important;
          font-weight: 600;
        }
      `}</style>
    </>
  )
}

export default function MapComponent() {
  return (
    <MapContainer
      center={PTELEOS_COORDINATES}
      zoom={6}
      scrollWheelZoom={false}
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <MapContent />
    </MapContainer>
  )
}
