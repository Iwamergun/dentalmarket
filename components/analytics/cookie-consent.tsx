'use client'

import { useState, useEffect } from 'react'
import { Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const CONSENT_KEY = 'cookie_consent'

export type ConsentStatus = 'accepted' | 'declined'

/**
 * Returns the current cookie consent status stored in localStorage,
 * or null if no preference has been recorded yet.
 */
export function getConsentStatus(): ConsentStatus | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CONSENT_KEY) as ConsentStatus | null
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!getConsentStatus()) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    window.dispatchEvent(new CustomEvent('cookie-consent-accepted'))
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Çerez onayı"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white shadow-premium animate-slide-up"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:py-5 md:px-6">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-body-text">
            Bu site, deneyiminizi iyileştirmek ve ziyaret istatistiklerini analiz etmek amacıyla çerezler
            kullanmaktadır. Analitik çerezler yalnızca onayınız ile etkinleştirilir.{' '}
            <a
              href="/gizlilik-politikasi"
              className="font-medium text-primary underline hover:no-underline"
            >
              Gizlilik Politikamız
            </a>{' '}
            ve{' '}
            <a
              href="/kvkk"
              className="font-medium text-primary underline hover:no-underline"
            >
              KVKK Aydınlatma Metni
            </a>
'ni inceleyebilirsiniz.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={handleDecline}>
            Reddet
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Kabul Et
          </Button>
        </div>
      </div>
    </div>
  )
}
