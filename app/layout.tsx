import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} antialiased`}>
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
