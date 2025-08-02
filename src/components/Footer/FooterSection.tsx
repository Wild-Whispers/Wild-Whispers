import { ReactNode } from "react";

export default function FooterSection({ children }: { children: ReactNode }) {
    return <div className="flex flex-col justify-center items-center gap-2">{children}</div>
}