"use client";

import NavbarAccountSection from "./NavbarAccountSection";
import NavbarButton from "./NavbarButton";
import NavbarSection from "./NavbarSection";
import NavbarTitleSection from "./NavbarTitleSection";

export default function Navbar() {
    return (
        <div className="
            flex
            flex-col
            md:flex-row
            justify-center
            sm:justify-between
            items-center
            m-0
            p-2
            flex-wrap

            bg-slate-300
            dark:bg-slate-950
            ">
            
            <div className="flex flex-row justify-center items-center gap-2">
                <NavbarTitleSection>
                    <img className="w-9 h-9 rounded-md" src="/assets/icon_v1.png"/>
                </NavbarTitleSection>

                {
                    process.env.NODE_ENV === "development" &&
                    <NavbarSection>
                        <NavbarButton label="Podcast" href="/podcast" />
                    </NavbarSection>
                }
            </div>

            <NavbarAccountSection />

        </div>
    );
}