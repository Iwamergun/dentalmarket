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
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 shadow-premium backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute -bottom-12 left-0 h-24 w-24 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-secondary-text">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5">
              {trendUp ? (
                <ArrowUpRight className="h-4 w-4 text-success" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              )}
              <span
                className={`text-xs font-semibold ${
                  trendUp ? 'text-success' : 'text-destructive'
                }`}
              >
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-secondary/20 bg-gradient-to-br from-secondary/20 via-secondary/10 to-accent/10 p-4 text-secondary shadow-subtle">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
