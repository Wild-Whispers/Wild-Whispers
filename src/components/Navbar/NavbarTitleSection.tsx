"use client";

import Link from "next/link";
import { ReactNode } from "react";

export default function NavbarTitleSection({ children }: { children: ReactNode}) {
    return (
        <Link href="/" className="flex flex-row justify-center items-center flex-wrap">
            {children}
        </Link>
    );
}