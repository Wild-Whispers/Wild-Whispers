"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export default function Container({ children }: { children: ReactNode }) {
    const moverRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (moverRef.current) {
            moverRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    }, [scrollY]);

    return (
        <div
            className="
                flex
                flex-col
                mx-auto
                items-center
                p-5
                w-4xl
                min-h-screen

                bg-fuchsia-950/30
                shadow-2xl
                shadow-fuchsia-950

                z-10
            ">
            {children}
        </div>
    );
}