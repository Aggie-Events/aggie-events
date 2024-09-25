"use client";

import React from 'react'
import './globals.css'

import Header from '../components/Header'
import Footer from '../components/Footer'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <>
        <Router>
            <html lang="en">
            <head>
                <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
                <link
                    href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@700&display=swap"
                    rel="stylesheet"/>
                <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
            </head>
            <body className="flex flex-col min-h-[100vh]"> 
                <Header />
                <div className="px-2 py-5">
                    {children}
                </div>  
                <Footer />
            </body>

        </html>
        </Router>
        </>
    )
}