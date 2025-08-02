"use client";

import Link from "next/link";

interface NavButtonProps {
    label: string,
    href: string
}

export default function NavbarButton({ label, href }: NavButtonProps) {
    return (
        <Link
            href={href}
            className="
            font-semibold
            text-sm
            border-b-2
            border-slate-950

            hover:text-stone-900
            hover:dark:text-stone-400
            hover:border-b-2
            hover:border-lime-600
            transition-colors
            duration-200

            flex-shrink-0
            ">
        {label}
        </Link>
    );
}