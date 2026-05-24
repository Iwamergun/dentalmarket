import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { CookieConsentBanner } from "@/components/analytics/cookie-consent";
import PushNotificationProvider from "@/components/push/PushNotificationProvider";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Dent Alışveriş - Diş Hekimliği Ürünleri ve Ekipmanları",
  description: "Diş hekimliği ürünleri ve ekipmanları için önde gelen B2B e-ticaret platformu",
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: [{ url: '/apple-touch-icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Dent Alışveriş - Diş Hekimliği Ürünleri ve Ekipmanları',
    description: 'Diş hekimliği ürünleri ve ekipmanları için önde gelen B2B e-ticaret platformu',
    images: [
      {
        url: '/brand/dentalisveris-logo.svg',
        type: 'image/svg+xml',
        alt: 'dentalışveriş premium brand logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${outfit.variable} ${dmSans.variable} antialiased`}>
        <GoogleAnalytics />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <PushNotificationProvider />
              {children}
              <CookieConsentBanner />
              <Toaster 
                position="bottom-right" 
                richColors 
                closeButton
                toastOptions={{
                  duration: 3000,
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
