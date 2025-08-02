"use client";

import type { ReactNode } from "react";

export interface ProfileCard {
    children: ReactNode,
    additionalClasses?: string[]
}

export default function Card({ children, additionalClasses = [] }: ProfileCard) {
    return (
        <div
            className={`
                flex
                p-2

                rounded-md
                bg-fuchsia-50/50
                ${additionalClasses.join(" ")}
            `}>
            {children}
        </div>
    );
}