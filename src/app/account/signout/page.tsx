"use client";

import { useUser } from "@/_Contexts/User.context";
import { Buttons } from "@/components/Buttons";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";

export default function Signout() {
    const router = useRouter();
    const [status, setStatus] = useState("");
    const [statusClass, setStatusClass] = useState("");
    const { setCurrentUser } = useUser();

    const handleSignout = () => {
        Cookies.set("user", "");
        setCurrentUser(undefined);

        setStatus("Signing you out, please wait...");
        setStatusClass("success-text");

        setTimeout(() => {
            router.push("/");
        }, 3000);
    };

    return (
        <Card additionalClasses={[
            "flex-col",
            "w-full",
            "gap-2"
        ]}>
            <h3 className="text-lg font-bold text-center">Are you sure you want to sign out?</h3>
            <p className={`text-md font-semibold text-center ${statusClass}`}>{status}</p>
            <Buttons.Action onClick={handleSignout}>Yes, sign out</Buttons.Action>
            <Buttons.Main onClick={() => router.back()}>No</Buttons.Main>
        </Card>
    );
}