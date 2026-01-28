import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
