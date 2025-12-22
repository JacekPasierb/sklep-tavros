import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header/Header";
import PromotionSection from "../components/layout/PromotionSection";
import SocialSection from "../components/common/SocialSection";
import PoliciesSection from "../components/common/PoliciesSection";
import PaymentsSection from "../components/common/PaymentsSection";
import Footer from "../components/layout/Footer/Footer";
import AuthSessionProvider from "../components/auth/AuthSessionProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://tavros.co.uk" // <- Twoja domena
      : "http://localhost:3000"
  ),
  title: "Tavros – Online Clothing & Accessories Store",
  description: "Discover Tavros collections for men, women and kids.",
  icons: {
    icon: [
      {url: "/favicon.ico", sizes: "any"},
      {url: "/favicon-16x16.png", sizes: "16x16", type: "image/png"},
      {url: "/favicon-32x32.png", sizes: "32x32", type: "image/png"},
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <AuthSessionProvider>
        <Header />
       
        <main>
          <PromotionSection />
          {children}
          <section className="grid grid-cols md:grid-cols-2 py-10">
            <SocialSection />
            <PoliciesSection />
          </section>
          <PaymentsSection />
          <Footer />
        </main>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
