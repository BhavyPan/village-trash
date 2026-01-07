'use client'

import { useState, useEffect } from 'react'
import { Gift, Star, Trophy, Camera, Target, Sparkles, Crown, Medal, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface VirtualGift {
  id: string
  name: string
  description: string
  imageUrl: string
  pointsCost: number
  category: 'badge' | 'trophy' | 'crown'
}

interface UserGift {
  id: string
  gift: VirtualGift
  redeemedAt: string
}

export default function KidsZone() {
  const [userPoints, setUserPoints] = useState(150)
  const [userGifts, setUserGifts] = useState<UserGift[]>([])
  const [availableGifts, setAvailableGifts] = useState<VirtualGift[]>([])
  const [selectedGift, setSelectedGift] = useState<VirtualGift | null>(null)
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [recentActivity, setRecentActivity] = useState<string[]>([])

  // Mock data for virtual gifts
  const mockGifts: VirtualGift[] = [
    {
      id: '1',
      name: 'Eco Warrior Badge',
      description: 'For reporting 5 trash locations',
      imageUrl: '/api/placeholder/100/100',
      pointsCost: 50,
      category: 'badge'
    },
    {
      id: '2',
      name: 'Clean Village Trophy',
      description: 'For helping clean 10 areas',
      imageUrl: '/api/placeholder/100/100',
      pointsCost: 100,
      category: 'trophy'
    },
    {
      id: '3',
      name: 'Green Crown',
      description: 'For being an environmental champion',
      imageUrl: '/api/placeholder/100/100',
      pointsCost: 200,
      category: 'crown'
    },
    {
      id: '4',
      name: 'Recycling Star',
      description: 'For promoting recycling',
      imageUrl: '/api/placeholder/100/100',
      pointsCost: 75,
      category: 'badge'
    },
    {
      id: '5',
      name: 'Nature Guardian Medal',
      description: 'For protecting nature',
      imageUrl: '/api/placeholder/100/100',
      pointsCost: 150,
      category: 'badge'
    },
    {
      id: '6',
      name: 'Super Cleaner Trophy',
      description: 'For exceptional cleaning efforts',
      imageUrl: '/api/placeholder/100/100',
      pointsCost: 175,
      category: 'trophy'
    }
  ]

  const mockUserGifts: UserGift[] = [
    {
      id: 'ug1',
      gift: mockGifts[0],
      redeemedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 'ug2',
      gift: mockGifts[3],
      redeemedAt: '2024-01-12T14:30:00Z'
    }
  ]

  const mockActivity = [
    'Earned 10 points for reporting trash near school',
    'Earned 15 points for helping clean the park',
    'Earned 5 points for recycling plastic bottles',
    'Redeemed Eco Warrior Badge',
    'Earned 20 points for organizing cleanup drive'
  ]

  useEffect(() => {
    setAvailableGifts(mockGifts)
    setUserGifts(mockUserGifts)
    setRecentActivity(mockActivity)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'badge': return <Medal className="w-6 h-6" />
      case 'trophy': return <Trophy className="w-6 h-6" />
      case 'crown': return <Crown className="w-6 h-6" />
      default: return <Gift className="w-6 h-6" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'badge': return 'from-blue-400 to-blue-600'
      case 'trophy': return 'from-yellow-400 to-yellow-600'
      case 'crown': return 'from-purple-400 to-purple-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const handleRedeemGift = (gift: VirtualGift) => {
    if (userPoints >= gift.pointsCost) {
      setSelectedGift(gift)
      setShowRedeemModal(true)
    }
  }

  const confirmRedeem = () => {
    if (selectedGift) {
      setUserPoints(prev => prev - selectedGift.pointsCost)
      const newUserGift: UserGift = {
        id: `ug${Date.now()}`,
        gift: selectedGift,
        redeemedAt: new Date().toISOString()
      }
      setUserGifts(prev => [...prev, newUserGift])
      setRecentActivity(prev => [`Redeemed ${selectedGift.name}`, ...prev])
      setShowRedeemModal(false)
      setSelectedGift(null)
    }
  }

  const getLevel = (points: number) => {
    if (points >= 500) return { name: 'Eco Master', color: 'text-purple-600' }
    if (points >= 300) return { name: 'Green Hero', color: 'text-blue-600' }
    if (points >= 150) return { name: 'Nature Friend', color: 'text-green-600' }
    if (points >= 50) return { name: 'Eco Helper', color: 'text-yellow-600' }
    return { name: 'Beginner', color: 'text-gray-600' }
  }

  const level = getLevel(userPoints)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-bold">Go Back</span>
            </Link>
          </div>
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
            <Star className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Kids Zone</h1>
          <p className="text-xl text-gray-600">Earn points and collect awesome rewards!</p>
        </div>

        {/* User Stats Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Progress</h2>
              <p className={`text-lg font-semibold ${level.color}`}>{level.name}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-2xl font-bold">{userPoints}</span>
              </div>
              <p className="text-sm text-gray-600">Points</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Current Level</span>
              <span>{Math.min(userPoints, 500)} / 500 points</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((userPoints / 500) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <Camera className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Report Trash</span>
              <span className="text-xs text-green-600">+10 pts</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <Target className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Join Cleanup</span>
              <span className="text-xs text-blue-600">+15 pts</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              <Sparkles className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Daily Task</span>
              <span className="text-xs text-purple-600">+5 pts</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors">
              <Gift className="w-8 h-8 text-yellow-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Redeem</span>
              <span className="text-xs text-yellow-600">Gifts</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Gifts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Gifts</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {availableGifts.map((gift) => {
                  const isOwned = userGifts.some(ug => ug.gift.id === gift.id)
                  const canAfford = userPoints >= gift.pointsCost

                  return (
                    <div
                      key={gift.id}
                      className={`border-2 rounded-xl p-4 transition-all ${
                        isOwned 
                          ? 'border-green-500 bg-green-50 opacity-75' 
                          : canAfford 
                            ? 'border-gray-200 hover:border-purple-300 hover:shadow-lg cursor-pointer'
                            : 'border-gray-200 opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => !isOwned && canAfford && handleRedeemGift(gift)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-r ${getCategoryColor(gift.category)} rounded-xl flex items-center justify-center text-white`}>
                          {getCategoryIcon(gift.category)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{gift.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{gift.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-purple-600">{gift.pointsCost} points</span>
                            {isOwned ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Owned</span>
                            ) : canAfford ? (
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Redeem</span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Not enough points</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* My Gifts & Activity */}
          <div className="lg:col-span-1 space-y-6">
            {/* My Gifts */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">My Gifts</h2>
              
              {userGifts.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {userGifts.map((userGift) => (
                    <div key={userGift.id} className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${getCategoryColor(userGift.gift.category)} rounded-xl flex items-center justify-center text-white mx-auto mb-2`}>
                        {getCategoryIcon(userGift.gift.category)}
                      </div>
                      <p className="text-xs text-gray-700 font-medium">{userGift.gift.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No gifts redeemed yet</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-600">{activity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Redeem Modal */}
        {showRedeemModal && selectedGift && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 bg-gradient-to-r ${getCategoryColor(selectedGift.category)} rounded-xl flex items-center justify-center text-white mx-auto mb-4`}>
                  {getCategoryIcon(selectedGift.category)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Redeem Gift</h3>
                <p className="text-gray-600">{selectedGift.name}</p>
                <p className="text-sm text-gray-500">{selectedGift.description}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Cost:</span>
                  <span className="font-bold text-purple-600">{selectedGift.pointsCost} points</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-700">Your points:</span>
                  <span className="font-bold text-green-600">{userPoints} points</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-purple-200">
                  <span className="text-gray-700">After redeem:</span>
                  <span className="font-bold text-gray-900">{userPoints - selectedGift.pointsCost} points</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRedeem}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Redeem Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
