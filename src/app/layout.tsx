import type { Metadata } from "next"
import { Poppins, JetBrains_Mono } from "next/font/google"
import { AppProvider } from "@/lib/app-context"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Nepal Salary Tax Calculator — FY 2081/82",
  description: "Calculate your Nepal income tax, SSF, CIT, and take-home salary. Supports all filing statuses and deductions under Income Tax Act 2058.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
