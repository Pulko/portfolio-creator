import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/Providers';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio Creator - Create Your Professional Portfolio in Minutes",
  description: "Create a beautiful, customizable portfolio website that showcases your projects, experience, and skills. No coding required - just fill in your details and deploy!",
  keywords: ["portfolio", "developer portfolio", "portfolio website", "portfolio creator", "github portfolio", "vercel portfolio"],
  authors: [{ name: "Fedor Tkachenko", url: "https://github.com/Pulko" }],
  creator: "Fedor Tkachenko",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio-creator.vercel.app",
    title: "Portfolio Creator - Create Your Professional Portfolio in Minutes",
    description: "Create a beautiful, customizable portfolio website that showcases your projects, experience, and skills.",
    siteName: "Portfolio Creator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Creator - Create Your Professional Portfolio in Minutes",
    description: "Create a beautiful, customizable portfolio website that showcases your projects, experience, and skills.",
    creator: "@Pulko",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <Navbar />
            <div className="mt-20">{children}</div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
