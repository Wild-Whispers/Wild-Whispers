"use client";

import Card from "@/components/Card";
import { ReactNode } from "react";

export default function CardProfileSocial({ children }: { children: ReactNode }) {
    return (
        <Card additionalClasses={["flex-col items-start gap-2 text-slate-800 font-semibold shadow-md bg-fuchsia-50/90"]}>{children}</Card>
    );
}