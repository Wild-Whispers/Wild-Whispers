import { ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {

    return (
        <div className="flex flex-col w-full gap-2">
            {children}
        </div>
    );
}