import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
  title: "RentElegance - Rent Designer Clothes for Every Occasion",
  description: "India's premier clothing rental platform. Rent designer lehengas, western dresses, traditional wear, shoes, and accessories for special occasions.",
  keywords: "clothing rental, lehenga rental, dress rental, designer clothes, fashion rental, India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <CartProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
