"use client";

import { ReactNode } from "react";

export default function ProfileName({ children }: { children: ReactNode }) {
    return <h1 className="text-2xl font-semibold">{children}</h1>;
}