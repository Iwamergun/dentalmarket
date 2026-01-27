import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dental Market",
  description: "Dental e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
