import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dentalmarket.com'),
  title: "Dental Market - Diş Hekimliği Ürünleri ve Ekipmanları",
  description: "Diş hekimliği ürünleri ve ekipmanları için önde gelen B2B e-ticaret platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
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
