'use client'

import { useState, useEffect, useRef } from 'react'
import { Camera, Upload, MapPin, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { dataStore, TrashReport } from '@/lib/data'
import Link from 'next/link'

export default function ReportTrash() {
  const [image, setImage] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [locationError, setLocationError] = useState<string | null>(null)
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; delay: number; duration: number }>>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{ hasTrash: boolean; confidence: number; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Generate particles only on client-side to avoid hydration mismatch
  useEffect(() => {
    const generatedParticles = [...Array(30)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }))
    setParticles(generatedParticles)
  }, [])

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsCameraOpen(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraOpen(false)
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const photoUrl = canvas.toDataURL('image/jpeg')
        setImage(photoUrl)
        stopCamera()
        analyzeImage(photoUrl)
      }
    }
  }

  const analyzeImage = async (imageUrl: string) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    
    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate AI detection logic (in production, this would call a real AI service)
    const hasTrash = Math.random() > 0.3 // 70% chance of detecting trash
    const confidence = hasTrash ? 0.75 + Math.random() * 0.2 : 0.6 + Math.random() * 0.3
    
    const result = {
      hasTrash,
      confidence: Math.round(confidence * 100),
      message: hasTrash 
        ? `AI detected trash with ${Math.round(confidence * 100)}% confidence. This appears to be ${['plastic waste', 'organic waste', 'paper trash', 'general litter'][Math.floor(Math.random() * 4)]}.`
        : `AI analysis complete with ${Math.round(confidence * 100)}% confidence. No trash detected in this image. Please upload a photo showing actual trash.`
    }
    
    setAnalysisResult(result)
    setIsAnalyzing(false)
    
    // If no trash detected, clear the image after showing the result
    if (!hasTrash) {
      setTimeout(() => {
        setImage(null)
        setAnalysisResult(null)
      }, 5000)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setImage(imageUrl)
        analyzeImage(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const getLocation = () => {
    setLocationError(null)
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please enable location permissions.')
        console.error('Geolocation error:', error)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!image || !location) {
      alert('Please capture a photo and provide location access')
      return
    }

    // Check if AI analysis detected trash
    if (analysisResult && !analysisResult.hasTrash) {
      alert('AI analysis detected no trash in this photo. Please upload a photo showing actual trash.')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Create new report with user info
      const newReport = await dataStore.addReport({
        description: description || 'Trash reported by villager',
        latitude: location.lat,
        longitude: location.lng,
        imageUrl: image,
        status: 'PENDING',
        user: {
          name: 'Anonymous Villager', // In production, this would come from authentication
          email: `villager_${Date.now()}@village.com`
        }
      })

      console.log('Trash report submitted and saved:', newReport)

      setSubmitStatus('success')
      // Reset form
      setImage(null)
      setDescription('')
      setLocation(null)
      setAnalysisResult(null)
      
    } catch (error) {
      console.error('Error submitting report:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600">
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
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="mb-6">
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-6"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-bold">Go Back</span>
                </Link>
              </div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6 animate-pulse-slow">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Report Trash</h1>
              <p className="text-white/80">Help keep our village clean by reporting trash locations</p>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">1. Take or Upload Photo</h2>
              
              {image ? (
                <div className="relative">
                  <img 
                    src={image} 
                    alt="Trash report" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Use Camera</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Photo</span>
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* AI Analysis Section */}
            {image && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">2. AI Trash Detection</h2>
                
                {isAnalyzing && (
                  <div className="flex items-center justify-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-blue-600 font-medium">AI is analyzing your photo...</p>
                      <p className="text-blue-500 text-sm mt-2">Detecting trash and waste items</p>
                    </div>
                  </div>
                )}

                {analysisResult && (
                  <div className={`p-4 rounded-lg border ${
                    analysisResult.hasTrash 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        analysisResult.hasTrash 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {analysisResult.hasTrash ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          analysisResult.hasTrash 
                            ? 'text-green-800' 
                            : 'text-red-800'
                        }`}>
                          {analysisResult.hasTrash 
                            ? 'Trash Detected Successfully!' 
                            : 'No Trash Detected'
                          }
                        </h3>
                        <p className={`text-sm mt-1 ${
                          analysisResult.hasTrash 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {analysisResult.message}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Confidence:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                analysisResult.hasTrash 
                                  ? 'bg-green-500' 
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${analysisResult.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {analysisResult.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {isCameraOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg mb-4"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Capture
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Location Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">2. Share Your Location</h2>
              
              {location ? (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">
                    Location captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={getLocation}
                  className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
                >
                  <MapPin className="w-6 h-6 text-gray-400 mr-2" />
                  <span className="text-gray-600">Get Current Location</span>
                </button>
              )}

              {locationError && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-sm text-red-800">{locationError}</span>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">3. Add Description (Optional)</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the trash situation (e.g., type of trash, amount, accessibility)"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !image || !location || isAnalyzing || (analysisResult?.hasTrash === false)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 
               isAnalyzing ? 'AI Analyzing...' :
               (analysisResult?.hasTrash === false) ? 'Please upload a photo with trash' :
               'Submit Report'}
            </button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm text-green-800">
                  Trash report submitted successfully! Thank you for helping keep our village clean.
                </span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm text-red-800">
                  Failed to submit report. Please try again.
                </span>
              </div>
            )}
          </form>
          </div>
        </div>
      </div>
    </div>
  )
}
