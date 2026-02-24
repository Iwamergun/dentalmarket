'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { type LucideIcon } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: React.ReactNode
}

export interface FaqCategory {
  title: string
  icon: LucideIcon
  items: FaqItem[]
}

export function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null)

  return (
    <div className="space-y-10">
      {categories.map((category, catIdx) => (
        <section key={catIdx}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <category.icon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
          </div>
          <div className="space-y-3">
            {category.items.map((item, itemIdx) => {
              const key = `${catIdx}-${itemIdx}`
              const isOpen = openKey === key
              return (
                <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setOpenKey(isOpen ? null : key)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform shrink-0 ml-4 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                      <div className="pt-4">{item.answer}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
