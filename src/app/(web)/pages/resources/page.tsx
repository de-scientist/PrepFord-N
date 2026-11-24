'use client'

import { useEffect, useState } from 'react'
import React from 'react'
import { useRouter } from 'next/navigation'
import {
    FaUserGraduate,
    FaStethoscope,
    FaAward,
    FaClipboardList,
    FaBookOpen,
    FaCrown,
    FaFire,
    FaStar,
    FaBolt,
} from 'react-icons/fa'

// Badge types with label, color, and icon
const badgePool = [
    { label: 'New', color: 'bg-green-500', icon: <FaStar className="mr-1" /> },
    { label: 'Hot', color: 'bg-red-500', icon: <FaFire className="mr-1" /> },
    { label: 'Updated', color: 'bg-yellow-500', icon: <FaBolt className="mr-1" /> },
    { label: 'Popular', color: 'bg-indigo-500', icon: <FaCrown className="mr-1" /> },
]

interface DashboardCard {
    label: string
    description: string
    icon: React.ReactElement
    route: string
    badge?: {
        label: string
        color: string
        icon: React.ReactElement
    }
}

// Move this outside to avoid useEffect ESLint warning
const rawCards: DashboardCard[] = [
    {
        label: 'NCLEX-RN EXAMS',
        description: 'Registered Nurse licensure exam prep.',
        icon: <FaAward className="text-green-600 text-3xl" />,
        route: '/pages/exams/nclex-rn',
    },
    {
        label: 'NCLEX-PN EXAMS',
        description: 'Practical Nurse licensure exam guide.',
        icon: <FaAward className="text-orange-600 text-3xl" />,
        route: '/pages/exams/nclex-pn',
    },
    {
        label: 'NCLEX-RN DASHBOARD',
        description: 'Manage your NCLEX-RN practice exams, study hierarchy, and analytics.',
        icon: <FaUserGraduate className="text-blue-600 text-3xl" />,
        route: '/dashboards/nclex-rn',
    },
    {
        label: 'NCLEX-PN DASHBOARD',
        description: 'Manage your NCLEX-PN practice exams, study hierarchy, and analytics.',
        icon: <FaStethoscope className="text-teal-600 text-3xl" />,
        route: '/dashboards/nclex-pn',
    },
    {
        label: 'NURSING STUDY NOTES',
        description: 'Review clinical nursing notes and domain study guides.',
        icon: <FaBookOpen className="text-purple-600 text-3xl" />,
        route: '/pages/notes',
    },
    {
        label: 'CUSTOM EXAM BUILDER',
        description: 'Build customized NCLEX-RN and NCLEX-PN practice examinations.',
        icon: <FaClipboardList className="text-indigo-600 text-3xl" />,
        route: '/pages/create',
    },
]

export default function DashboardsPage() {
    const router = useRouter()
    const [lastOpenedRoute, setLastOpenedRoute] = useState<string | null>(null)

    const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([])

    // Assign badges randomly
    function assignRandomBadges(cards: DashboardCard[]) {
        const maxBadges = 5
        const shuffled = [...cards].sort(() => 0.5 - Math.random()).slice(0, maxBadges)
        return cards.map((card) => {
            const matched = shuffled.find((c) => c.route === card.route)
            return {
                ...card,
                badge: matched ? badgePool[Math.floor(Math.random() * badgePool.length)] : undefined,
            }
        })
    }

    useEffect(() => {
        const updated = assignRandomBadges(rawCards)
        setDashboardCards(updated)

        const last = localStorage.getItem('lastOpenedRoute')
        if (last) setLastOpenedRoute(last)
    }, [])

    const handleCardClick = (route: string) => {
        localStorage.setItem('lastOpenedRoute', route)
        router.push(route)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-100 to-pink-300 pt-8 pb-10 px-4 md:px-10">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-3">
                📚 Explore All Resources.
            </h1>

            <div className="border-2 border-gray-300 rounded-2xl p-6 shadow-inner bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {dashboardCards.map((card, index) => {
                        const isLastOpened = lastOpenedRoute === card.route

                        return (
                            <div
                                key={index}
                                onClick={() => handleCardClick(card.route)}
                                className={`relative cursor-pointer bg-gradient-to-br from-indigo-200 via-gray-50 to-pink-100 rounded-xl shadow hover:shadow-xl transition-all duration-300 p-5 border hover:border-green-500 ${isLastOpened ? 'ring-2 ring-purple-400 bg-purple-50' : ''
                                    }`}
                            >
                                {card.badge && (
                                    <span
                                        className={`absolute top-3 right-3 text-black font-bold text-xs px-2 py-1 rounded-full shadow-sm flex items-center ${card.badge.color
                                            } ${isLastOpened ? 'opacity-50' : ''}`}
                                    >
                                        {card.badge.icon}
                                        {card.badge.label}
                                    </span>
                                )}

                                {isLastOpened && (
                                    <span className="animate-pulse absolute top-3 left-3 font-bold bg-purple-300 border text-black text-xs px-3 py-1 rounded-full shadow-md">
                                        Last Opened
                                    </span>
                                )}

                                <div className="mb-4 flex justify-center">{card.icon}</div>

                                <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
                                    {card.label}
                                </h2>

                                <p className="text-sm text-gray-600 text-center">{card.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
