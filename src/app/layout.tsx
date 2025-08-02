"use client";

import "./globals.css"; // Tailwind or global styles here
import { ReactNode, useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { UserContextProvider } from "@/_Contexts/User.context";
import Container from "@/components/Container";

export default function RootLayout({ children }: { children: ReactNode }) {
    // Handle parallax scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            document.body.style.backgroundPositionY = `${scrollY * 0.7}px`;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <html lang="en" className="bg-stone-50 dark:bg-stone-950 text-stone-950 dark:text-stone-50">
            <head>
                <meta charSet="UTF-8" />
                <link rel="shortcut icon" href="/assets/icon_v1.png" type="image/x-icon"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title></title>
            </head>
            <body className="
                flex
                flex-col
                min-h-screen
                
                bg-[url('/assets/backgrounds/background.png')]
                bg-no-repeat
                bg-cover
                bg-scroll
                bg-center
            ">
                <UserContextProvider>

                    <Navbar />

                    <Container>
                        {children}
                    </Container>
                    
                    <Footer />

                </UserContextProvider>
            </body>
        </html>
    );
}