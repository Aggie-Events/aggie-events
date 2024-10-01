import React from 'react'
import './globals.css'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/components/auth/AuthContext'
import { ToastRenderer } from '@/components/toast/ToastRenderer'

export default function RootLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head />
            <body className="flex flex-col min-h-screen relative">
                <AuthProvider>
                    <Header />
                    <ToastRenderer />
                    <div className="px-2 py-5">
                        {children}
                    </div>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    )
}