import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "./_components/ui/sonner"
import Footer from "./_components/footer"
import AuthProvider from "./_providers/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MCZ Barbearia",
  description: "📞 82 9 9327-6721 WhatsApp",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" className="dark">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <AuthProvider>
          <main className="flex-grow">{children}</main>
          <Toaster />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
