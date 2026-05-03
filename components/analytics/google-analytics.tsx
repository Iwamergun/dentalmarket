'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getConsentStatus } from './cookie-consent'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

function pageview(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url })
}

export function GoogleAnalytics() {
  const pathname = usePathname()
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    // Check consent that may have been stored in a previous session
    if (getConsentStatus() === 'accepted') {
      setConsentGiven(true)
    }

    // Listen for the consent event fired by CookieConsentBanner
    const handleConsent = () => setConsentGiven(true)
    window.addEventListener('cookie-consent-accepted', handleConsent)
    return () => window.removeEventListener('cookie-consent-accepted', handleConsent)
  }, [])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !consentGiven) return
    pageview(pathname)
  }, [pathname, consentGiven])

  if (!GA_MEASUREMENT_ID || !consentGiven) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
