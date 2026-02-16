'use client'

import {
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  trend?: string
  trendUp?: boolean
}

const iconMap = {
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  DollarSign,
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendUp,
}: StatsCardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap] || Package

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trendUp ? (
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-xs ml-1 ${
                  trendUp ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
