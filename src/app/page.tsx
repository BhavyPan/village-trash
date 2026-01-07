'use client'

import Link from 'next/link'
import { Camera, Map, Users, Gift, Leaf, Award, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; delay: number; duration: number }>>([])

  // Generate particles only on client-side to avoid hydration mismatch
  useEffect(() => {
    const generatedParticles = [...Array(50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }))
    setParticles(generatedParticles)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600">
        <div className="absolute inset-0 bg-black/20">
          {/* Animated particles - now deterministic */}
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
                <div className="w-2 h-2 bg-white/30 rounded-full blur-sm"></div>
              </div>
            ))}
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="absolute bottom-32 left-32 animate-bounce" style={{ animationDelay: '1.5s' }}>
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-lg rounded-full mb-6 animate-pulse-slow shadow-2xl">
                <Leaf className="w-12 h-12 text-white animate-spin-slow" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Clean Villages,
              </span>
              <span className="block bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
                Happy Communities
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Join us in making our villages cleaner and greener. Report trash, volunteer for cleanup, 
              and earn rewards while making a difference in your community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/report"
                className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
              >
                <span className="relative z-10">📸 Report Trash Now</span>
                <div className="absolute inset-0 bg-white/20 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </Link>
              
              <Link
                href="/volunteer"
                className="group relative px-10 py-5 bg-white/20 backdrop-blur-lg text-white rounded-full font-bold text-lg border-2 border-white/30 hover:bg-white/30 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
              >
                <span className="relative z-10">🤝 Become a Volunteer</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white/10 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How It Works
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Simple steps to make your village cleaner and greener
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Camera, title: 'Report Trash', desc: 'Take a photo and report trash locations', color: 'from-blue-400 to-cyan-500' },
                { icon: Map, title: 'View on Map', desc: 'See all reported trash areas on interactive map', color: 'from-green-400 to-emerald-500' },
                { icon: Users, title: 'Volunteer', desc: 'Join cleanup efforts and make a difference', color: 'from-purple-400 to-pink-500' },
                { icon: Gift, title: 'Earn Rewards', desc: 'Kids earn points and virtual gifts for helping', color: 'from-yellow-400 to-orange-500' }
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div 
                    key={index}
                    className="group text-center animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/70">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { number: '500+', label: 'Trash Reports', color: 'from-yellow-400 to-orange-500' },
                { number: '50+', label: 'Active Volunteers', color: 'from-blue-400 to-cyan-500' },
                { number: '100+', label: 'Clean Areas', color: 'from-green-400 to-emerald-500' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-white text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-slow">
                <Award className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Make a Difference?
              </h2>
              
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join our community of villagers working together for a cleaner environment
              </p>
              
              <Link
                href="/report"
                className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-bold text-lg hover:from-green-500 hover:to-emerald-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
              >
                Get Started Today
                <TrendingUp className="w-6 h-6 ml-3" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
