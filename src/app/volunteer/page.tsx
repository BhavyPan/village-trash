'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Users, Camera, Upload, MapPin, CheckCircle, Clock, AlertCircle, Filter, ArrowLeft } from 'lucide-react'
import { dataStore, TrashReport } from '@/lib/data'
import Link from 'next/link'

// Create a separate interface for Map component that excludes null
interface MapTrashReport {
  id: string
  description?: string
  latitude: number
  longitude: number
  imageUrl?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  createdAt: string
  user: {
    name?: string
    email?: string
  }
  cleaning?: {
    id: string
    afterImageUrl?: string
    cleanedAt: string
  }
}

const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
})

export default function VolunteerDashboard() {
  const [reports, setReports] = useState<TrashReport[]>([])
  const [selectedReport, setSelectedReport] = useState<TrashReport | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [afterImage, setAfterImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; delay: number; duration: number }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate particles only on client-side to avoid hydration mismatch
  useEffect(() => {
    const generatedParticles = [...Array(40)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }))
    setParticles(generatedParticles)
  }, [])

  // Load real reports from data store
  useEffect(() => {
    const loadReports = async () => {
      const allReports = await dataStore.getReports()
      setReports(allReports)
    }

    // Initial load
    loadReports()

    // Set up interval to refresh data (simulating real-time updates)
    const interval = setInterval(loadReports, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true
    return report.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'IN_PROGRESS': return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
      case 'COMPLETED': return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <AlertCircle className="w-4 h-4" />
      case 'IN_PROGRESS': return <Clock className="w-4 h-4" />
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleStartCleaning = async (reportId: string) => {
    const updatedReport = await dataStore.updateReportStatus(reportId, 'IN_PROGRESS')
    if (updatedReport) {
      // Refresh the reports list
      const allReports = await dataStore.getReports()
      setReports(allReports)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAfterImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitAfterPhoto = async () => {
    if (!selectedReport || !afterImage) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const updatedReport = await dataStore.addCleaning(selectedReport.id, afterImage)
      
      if (updatedReport) {
        // Refresh the reports list
        const allReports = await dataStore.getReports()
        setReports(allReports)
      }

      setAfterImage(null)
      setSelectedReport(null)
      
    } catch (error) {
      console.error('Error submitting after photo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600">
        <div className="absolute inset-0 bg-black/20">
          {/* Animated particles */}
          <div className="absolute inset-0">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute animate-pulse"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`
                }}
              >
                <div className="w-2 h-2 bg-white/20 rounded-full blur-sm"></div>
              </div>
            ))}
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="mb-6">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-bold">Go Back</span>
              </Link>
            </div>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-6 animate-pulse-slow">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Volunteer Dashboard</h1>
            <p className="text-white/80">Manage trash reports and help keep our village clean</p>
          </div>

          {/* Map Section - Full Width */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">🗺️ Live Trash Map</h2>
              <p className="text-white/80">Click on markers to view report details and take action</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Map - Takes 2/3 space */}
              <div className="lg:col-span-2">
                <div className="h-96 lg:h-[500px] bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border-2 border-white/30">
                  <MapComponent 
                    reports={filteredReports.map(report => ({
                      ...report,
                      description: report.description || undefined,
                      imageUrl: report.imageUrl || undefined,
                      user: {
                        name: report.user.name || undefined,
                        email: report.user.email || undefined
                      },
                      cleaning: report.cleaning ? {
                        ...report.cleaning,
                        afterImageUrl: report.cleaning.afterImageUrl || undefined
                      } : undefined
                    }))}
                    onReportClick={setSelectedReport}
                  />
                </div>
                
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm bg-yellow-400/20 backdrop-blur px-3 py-1 rounded-full border border-yellow-400/30">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="font-medium text-yellow-100">Pending</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-blue-400/20 backdrop-blur px-3 py-1 rounded-full border border-blue-400/30">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="font-medium text-blue-100">In Progress</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-green-400/20 backdrop-blur px-3 py-1 rounded-full border border-green-400/30">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="font-medium text-green-100">Completed</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats - Takes 1/3 space */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-400/20 to-cyan-400/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="font-bold text-white mb-4">📊 Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Total Reports</span>
                      <span className="font-bold text-white text-xl">{reports.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Pending</span>
                      <span className="font-bold text-yellow-300 text-xl">{reports.filter(r => r.status === 'PENDING').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">In Progress</span>
                      <span className="font-bold text-blue-300 text-xl">{reports.filter(r => r.status === 'IN_PROGRESS').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Completed</span>
                      <span className="font-bold text-green-300 text-xl">{reports.filter(r => r.status === 'COMPLETED').length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="font-bold text-white mb-4">🎯 Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setFilter('PENDING')}
                      className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-lg rounded-xl hover:bg-white/30 transition-all duration-300 text-white font-medium"
                    >
                      📍 View Pending Only
                    </button>
                    <button
                      onClick={() => setFilter('all')}
                      className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-lg rounded-xl hover:bg-white/30 transition-all duration-300 text-white font-medium"
                    >
                      🗺️ View All Reports
                    </button>
                  </div>
                </div>

                {selectedReport && (
                  <div className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="font-bold text-white mb-4">📍 Selected Report</h3>
                    <div className="text-sm space-y-2 mb-4">
                      <p className="text-white/80"><strong>ID:</strong> {selectedReport.id}</p>
                      <p className="text-white/80"><strong>Status:</strong> {selectedReport.status}</p>
                      <p className="text-white/80"><strong>Location:</strong> {selectedReport.latitude.toFixed(4)}, {selectedReport.longitude.toFixed(4)}</p>
                      <p className="text-white/80"><strong>Reporter:</strong> {selectedReport.user.name || 'Anonymous'}</p>
                    </div>
                    
                    {/* Directions Buttons */}
                    <div className="space-y-2">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedReport.latitude},${selectedReport.longitude}`}
                        target="_blank"
                        className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-all duration-300 font-medium"
                      >
                        🧭 Google Maps Directions
                      </a>
                      <a
                        href={`https://www.openstreetmap.org/directions?from=&to=${selectedReport.latitude},${selectedReport.longitude}`}
                        target="_blank"
                        className="w-full flex items-center justify-center gap-2 bg-purple-500 text-white py-3 px-4 rounded-xl hover:bg-purple-600 transition-all duration-300 font-medium"
                      >
                        🗺️ OpenStreetMap Directions
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">📋 Detailed Reports</h2>
              <p className="text-white/80">Manage individual trash reports and track cleaning progress</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report, index) => (
                <div 
                  key={report.id} 
                  className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 border border-white/20 animate-fade-in-up"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  {/* Before Image */}
                  <div className="relative h-48">
                    <img
                      src={report.imageUrl || 'https://images.unsplash.com/photo-1559009559-0d89c3d8b9d7?w=400&h=300&fit=crop'}
                      alt="Trash report"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-white mb-3 text-lg">Trash Report</h3>
                    <p className="text-sm text-white/80 mb-4 line-clamp-2">
                      {report.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-xs text-white/60 bg-white/10 backdrop-blur px-3 py-2 rounded-lg">
                        <MapPin className="w-4 h-4" />
                        <span>{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span className="bg-white/10 backdrop-blur px-2 py-1 rounded">by {report.user.name || 'Anonymous'}</span>
                        <span className="bg-white/10 backdrop-blur px-2 py-1 rounded">{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* After Image (if completed) */}
                    {report.cleaning?.afterImageUrl && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-green-300 mb-2">✅ After Cleaning:</h4>
                        <img
                          src={report.cleaning.afterImageUrl}
                          alt="After cleaning"
                          className="w-full h-32 object-cover rounded-lg border-2 border-green-400/30"
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {report.status === 'PENDING' && (
                        <button
                          onClick={() => handleStartCleaning(report.id)}
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          🧹 Start Cleaning
                        </button>
                      )}

                      {report.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          📸 Upload After Photo
                        </button>
                      )}

                      {report.status === 'COMPLETED' && (
                        <button
                          disabled
                          className="w-full bg-white/20 backdrop-blur text-white py-3 px-4 rounded-xl font-bold cursor-not-allowed"
                        >
                          ✅ Completed
                        </button>
                      )}

                      {/* Directions Buttons */}
                      <div className="flex gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${report.latitude},${report.longitude}`}
                          target="_blank"
                          className="flex-1 bg-blue-500/80 backdrop-blur text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-blue-600 transition-all duration-300 text-center"
                        >
                          🧭 Google
                        </a>
                        <a
                          href={`https://www.openstreetmap.org/directions?from=&to=${report.latitude},${report.longitude}`}
                          target="_blank"
                          className="flex-1 bg-purple-500/80 backdrop-blur text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-purple-600 transition-all duration-300 text-center"
                        >
                          🗺️ OSM
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Reports Yet</h3>
                <p className="text-white/60 mb-6">
                  {filter === 'all' 
                    ? "No trash reports have been submitted yet. Ask villagers to report trash locations!"
                    : "No trash reports match the current filter."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {filter !== 'all' && (
                    <button
                      onClick={() => setFilter('all')}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      View All Reports
                    </button>
                  )}
                  <a
                    href="/report"
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    📸 Report Trash
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* After Photo Upload Modal */}
          {selectedReport && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl max-w-md w-full p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Upload After Photo</h3>
                
                <div className="mb-6">
                  <img
                    src={selectedReport.imageUrl || 'https://images.unsplash.com/photo-1559009559-0d89c3d8b9d7?w=400&h=300&fit=crop'}
                    alt="Before cleaning"
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                  <p className="text-white/80 text-sm mb-4">{selectedReport.description}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">After Photo:</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white/20 backdrop-blur border border-white/30 text-white py-3 px-4 rounded-xl hover:bg-white/30 transition-all duration-300 font-medium"
                  >
                    📸 Choose Photo
                  </button>
                  
                  {afterImage && (
                    <img
                      src={afterImage}
                      alt="After cleaning preview"
                      className="w-full h-48 object-cover rounded-xl mt-4"
                    />
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedReport(null)
                      setAfterImage(null)
                    }}
                    className="flex-1 bg-white/20 backdrop-blur border border-white/30 text-white py-3 px-4 rounded-xl hover:bg-white/30 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitAfterPhoto}
                    disabled={!afterImage || isSubmitting}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Uploading...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
