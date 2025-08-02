"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = {
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function Main({ children, ...props }: ButtonProps) {
    return <button
        className="
            button-element

            bg-violet-900
            border-violet-50

            hover:bg-violet-700
            hover:border-violet-400
        "
        {...props}>
        {children}
    </button>
}

function Action({ children, ...props }: ButtonProps) {
    return <button
        className="
            button-element

            bg-blue-600
            border-blue-50
            
            hover:bg-blue-700
            hover:border-blue-400
        "
        {...props}>
        {children}
    </button>
}


// Export
export const Buttons = {
    Main,
    Action
};