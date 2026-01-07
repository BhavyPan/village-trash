'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, Filter, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { dataStore, TrashReport } from '@/lib/data'
import Link from 'next/link'

const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
})

export default function TrashMap() {
  const [reports, setReports] = useState<TrashReport[]>([])
  const [filteredReports, setFilteredReports] = useState<TrashReport[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedReport, setSelectedReport] = useState<TrashReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load real reports from data store
    const loadReports = () => {
      const allReports = dataStore.getReports()
      setReports(allReports)
      setFilteredReports(allReports)
      setLoading(false)
    }

    // Initial load
    loadReports()

    // Set up interval to refresh data (simulating real-time updates)
    const interval = setInterval(loadReports, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredReports(reports)
    } else {
      setFilteredReports(reports.filter(report => report.status === selectedStatus))
    }
  }, [selectedStatus, reports])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <AlertCircle className="w-4 h-4" />
      case 'IN_PROGRESS': return <Filter className="w-4 h-4" />
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-bold">Go Back</span>
            </Link>
          </div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trash Map</h1>
          <p className="text-gray-600">View all reported trash locations in your village</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map</h2>
                <p className="text-sm text-gray-600">Click on markers to view report details</p>
              </div>
              
              <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                <MapComponent 
                  reports={filteredReports}
                  onReportClick={setSelectedReport}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reports List Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Reports List</h2>
                
                {/* Filter */}
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          {report.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-800 mb-2 line-clamp-2">
                        {report.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          by {report.user.name || 'Anonymous'}
                        </span>
                        <MapPin className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredReports.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No reports found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Trash Report Details</h3>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {selectedReport.imageUrl && (
                  <img
                    src={selectedReport.imageUrl}
                    alt="Trash report"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Description</h4>
                    <p className="text-gray-600">{selectedReport.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Status</h4>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedReport.status)}`}>
                      {getStatusIcon(selectedReport.status)}
                      {selectedReport.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                    <p className="text-gray-600">
                      {selectedReport.latitude.toFixed(6)}, {selectedReport.longitude.toFixed(6)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Reported by</h4>
                    <p className="text-gray-600">{selectedReport.user.name || 'Anonymous'}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Reported on</h4>
                    <p className="text-gray-600">
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
