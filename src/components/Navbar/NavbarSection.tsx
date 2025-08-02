"use client";

import { ReactNode } from "react";

export default function NavbarSection({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-row justify-center items-center gap-2 flex-wrap">
            {children}
        </div>
    );
}