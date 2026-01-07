'use client'

import { useState } from 'react'

interface TrashReport {
  id: string
  description?: string
  latitude: number
  longitude: number
  imageUrl?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  createdAt: string
  user: {
    name?: string
  }
}

interface SimpleMapProps {
  reports: TrashReport[]
  onReportClick: (report: TrashReport) => void
}

export default function SimpleMap({ reports, onReportClick }: SimpleMapProps) {
  const [selectedReport, setSelectedReport] = useState<TrashReport | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500'
      case 'IN_PROGRESS': return 'bg-blue-500'
      case 'COMPLETED': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4" style={{ minHeight: '400px' }}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Trash Locations</h3>
        <p className="text-sm text-gray-600">Click on any report to view details</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
        {reports.map((report) => (
          <div
            key={report.id}
            onClick={() => {
              setSelectedReport(report)
              onReportClick(report)
            }}
            className="bg-white rounded-lg p-3 shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></div>
              <span className="text-xs font-medium text-gray-700">
                {report.status.replace('_', ' ')}
              </span>
            </div>
            
            <p className="text-xs text-gray-600 mb-1 line-clamp-2">
              {report.description || 'No description'}
            </p>
            
            <div className="text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span>{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
              </div>
              <div className="mt-1">
                by {report.user.name || 'Anonymous'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-gray-500">No trash reports available</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Completed</span>
        </div>
      </div>
    </div>
  )
}
