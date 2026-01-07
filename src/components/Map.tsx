'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { TrashReport } from '@/lib/data'

// Import SimpleMap as fallback
const SimpleMap = dynamic(() => import('./SimpleMap'), { ssr: false })

interface MapProps {
  reports: TrashReport[]
  onReportClick: (report: TrashReport) => void
}

export default function Map({ reports, onReportClick }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return

      try {
        setIsLoaded(true)
        
        // Import Leaflet
        const leaflet = await import('leaflet')
        
        // Fix default icon issue
        if (typeof window !== 'undefined') {
          delete (leaflet.Icon.Default.prototype as any)._getIconUrl
          leaflet.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          })
        }

        // Initialize the map
        const map = leaflet.map(mapRef.current, {
          center: [28.6139, 77.2090],
          zoom: 13,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          dragging: true,
          touchZoom: true,
          boxZoom: true,
          keyboard: true
        })

        // Add OpenStreetMap tiles
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors | Village Trash Management',
          maxZoom: 19,
          minZoom: 3
        }).addTo(map)

        // Add zoom control
        leaflet.control.zoom({
          position: 'topright',
          zoomInText: '+',
          zoomOutText: '-'
        }).addTo(map)

        // Add scale control
        leaflet.control.scale({
          position: 'bottomleft',
          metric: true,
          imperial: false
        }).addTo(map)

        mapInstanceRef.current = map
        setError(null)
        setUseFallback(false)
      } catch (error) {
        console.error('Error initializing map:', error)
        setError('Failed to load interactive map. Using simple view.')
        setIsLoaded(false)
        setUseFallback(true)
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMap, 100)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || useFallback) return

    const updateMarkers = async () => {
      try {
        const leaflet = await import('leaflet')

        // Clear existing markers
        markersRef.current.forEach(marker => {
          if (mapInstanceRef.current && marker) {
            mapInstanceRef.current.removeLayer(marker)
          }
        })
        markersRef.current = []

        // Add markers for each report
        for (const report of reports) {
          const getMarkerColor = (status: string) => {
            switch (status) {
              case 'PENDING': return '#f59e0b'
              case 'IN_PROGRESS': return '#3b82f6'
              case 'COMPLETED': return '#10b981'
              default: return '#6b7280'
            }
          }

          const markerIcon = leaflet.divIcon({
            html: `<div style="background-color: ${getMarkerColor(report.status)}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            className: 'custom-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })

          const marker = leaflet.marker([report.latitude, report.longitude], { icon: markerIcon })
            .addTo(mapInstanceRef.current)
            .on('click', () => onReportClick(report))

          markersRef.current.push(marker)

          // Add popup with directions
          const popupContent = `
            <div style="padding: 8px; min-width: 200px;">
              <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">Trash Report</h4>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${report.description || 'No description'}</p>
              <p style="margin: 0 0 2px 0; font-size: 11px; color: #888;">Status: ${report.status.replace('_', ' ')}</p>
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #888;">by ${report.user.name || 'Anonymous'}</p>
              <div style="border-top: 1px solid #eee; padding-top: 8px; margin-top: 8px;">
                <a href="https://www.google.com/maps/dir/?api=1&destination=${report.latitude},${report.longitude}" 
                   target="_blank" 
                   style="display: inline-block; background: #4285f4; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 12px; margin-right: 4px;">
                  🧭 Get Directions
                </a>
                <a href="https://www.openstreetmap.org/directions?from=&to=${report.latitude},${report.longitude}" 
                   target="_blank" 
                   style="display: inline-block; background: #7c4dff; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 12px;">
                  🗺️ OSM Directions
                </a>
              </div>
            </div>
          `
          marker.bindPopup(popupContent)
        }

        // Fit map to show all markers
        if (reports.length > 0) {
          const group = new leaflet.FeatureGroup(
            reports.map(report => leaflet.marker([report.latitude, report.longitude]))
          )
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
        }
      } catch (error) {
        console.error('Error updating markers:', error)
        setUseFallback(true)
      }
    }

    updateMarkers()
  }, [reports, onReportClick, isLoaded, useFallback])

  // Use fallback map if there's an error
  if (useFallback || error) {
    return <SimpleMap reports={reports} onReportClick={onReportClick} />
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  )
}
