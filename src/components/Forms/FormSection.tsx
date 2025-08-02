"use client";

import type { ReactNode } from "react"

interface FormSections {
    children: ReactNode,
    optionalStyling: string | null
}

export default function FormSection({ children, optionalStyling }: FormSections) {
    return <div
        className={`
            flex
            flex-col

            gap-2
            ${optionalStyling}
        `}>
        {children}
    </div>
}