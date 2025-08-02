"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavbarSection from "./NavbarSection";
import NavbarButton from "./NavbarButton";
import { useUser } from "@/_Contexts/User.context";
import isUser from "@/_Interfaces/User";
import UserExtraSmallImage from "../UserProfileImages/UserExtraSmallImage";

export default function NavbarAccountSection() {
    const { currentUser } = useUser();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (isUser(currentUser)) {
        // Get user ID & query string
        const uid = currentUser.uid;

        return (
            <NavbarSection>
                <div className="
                    flex
                    flex-row
                    justify-center
                    items-center

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
                    cursor-pointer

                    flex-shrink-0
                    gap-2
                    ">
                    <UserExtraSmallImage user={currentUser} />
                    <Link href={`/profile?uid=${uid}`}>{currentUser.userName}</Link>
                </div>
                <NavbarButton label="Sign Out" href="/account/signout" />
            </NavbarSection>
        );
    }

    return (
        <NavbarSection>
            <NavbarButton label="Register" href="/account/register" />
            <NavbarButton label="Sign In" href="/account/signin" />
        </NavbarSection>
    );
}