"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type AccountFormProps = {
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLFormElement>;

export default function FormAccount({ children, ...props }: AccountFormProps) {
    return (
        <form
            className="
                flex
                flex-col
                p-5
                rounded-2xl
                
                bg-slate-400/30
                gap-5
            "
            {...props}>
            {children}
        </form>
    );
}