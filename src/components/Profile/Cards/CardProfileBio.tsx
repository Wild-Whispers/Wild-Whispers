"use client";

import { ActionUserUpdateBio } from "@/_Actions/ActionUserUpdateBio";
import { useUser } from "@/_Contexts/User.context";
import Card from "@/components/Card";
import { useEffect, useRef, useState } from "react";

export default function CardProfileBio() {
    const { currentUser, user, currentUserOwnsProfile, setCurrentUser, setUser, uidFromURL } = useUser();
    if (!user) return;

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const pRef = useRef<HTMLParagraphElement>(null);
    const [bioText, setBioText] = useState("");

    const handleValueClick = () => {
        if (pRef.current && inputRef.current && currentUserOwnsProfile) {
            pRef.current.style.display = "none";
            inputRef.current.style.display = "inline";
            
            inputRef.current.focus();
            inputRef.current.select();
        }
    };

    const handleBlur = async () => {
        if (pRef.current && inputRef.current && currentUserOwnsProfile && currentUser) {
            inputRef.current.style.display = "none";
            pRef.current.style.display = "inline";

            const newBio = inputRef.current.value;
            
            if (
                newBio !== "You have not set your bio yet." &&
                newBio !== `${user.userName} has not set their bio yet.` &&
                newBio.trim().length > 0
            ) {
                await ActionUserUpdateBio(user.uid, newBio);
                pRef.current.innerText = newBio;
            }
        }
    };

    const handleInputChange = async () => {
        if (inputRef.current && pRef.current && currentUserOwnsProfile && currentUser) {
            const newBio = inputRef.current.value;

            if (
                newBio !== `You have not set your bio yet.`
                || newBio !== `${user.userName} has not set their bio yet.`
                || newBio.trim().length === 0
            ) {
                await ActionUserUpdateBio(user.uid, newBio);
                pRef.current.innerText = newBio;
            }
        }
    };

    useEffect(() => {
        if (currentUserOwnsProfile) {
            setBioText(`You have not set your bio yet.`);
        } else {
            setBioText(`${user.userName} has not set their bio yet.`);
        }

        if (user.userData.bio) {
            setBioText(user.userData.bio);
        }
    }, []);

    return (
        <Card additionalClasses={[
            "flex-col",
            "w-full"
        ]}>
            <h3 className="text-md font-semibold">{currentUserOwnsProfile ? "Your" : `${user.userName}'s`} Bio</h3>
            <div className="flex flex-col">
                <textarea
                    ref={inputRef}
                    className="hidden"
                    defaultValue={bioText}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleInputChange();
                            inputRef.current?.blur();
                        }
                    }}
                ></textarea>
                <p className={`inline text-sm ${!user.userData.bio ? "font-semibold" : user.userData.bio}`} ref={pRef} onClick={handleValueClick}>{bioText}</p>
            </div>
        </Card>
    );
}