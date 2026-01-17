import { Footer, Header } from "@/components";
import { CartProvider } from "@/context/CartContext";
import { ClientAuthProvider } from "@/context/ClientAuthContext";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "VitaCare - Votre Parapharmacie en Ligne",
  description: "VitaCare - Découvrez notre sélection de produits de parapharmacie pour votre bien-être et vos soins au quotidien.",
  icons: {
    icon: "/logo-vitacare.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased bg-[#F9F8F6]`}>
        <ClientAuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </ClientAuthProvider>
      </body>
    </html>
  );
}
