import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Klok",
  description: "A modern social media application powered by Next.js"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <div className='h-screen flex flex-col'>
              {/* Navbar */}
              <Navbar />

              {/* Main content */}
              <main className='flex flex-1 py-8'>
                <div className='max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-12 gap-6'>
                  {/* Sidebar visibile solo su desktop */}
                  <aside className='hidden lg:block lg:col-span-3'>
                    <Sidebar />
                  </aside>

                  {/* Contenuto principale */}
                  <section className='lg:col-span-9 w-full'>{children}</section>
                </div>
              </main>
            </div>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
