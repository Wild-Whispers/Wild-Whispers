"use client";

import { ActionUserUpdateInfoQuestions } from "@/_Actions/ActionUserUpdateInfoQuestions";
import { InfoCardTypes } from "@/_Enums/InfoCardTypes";
import { User } from "@/_Interfaces/User";
import { useRef } from "react";

export interface InfoCardSectionProps {
    currentUser: User | undefined,
    label: string,
    text: string,
    type: InfoCardTypes,
    currentUserOwnsProfile: boolean
}

export default function ProfileInfoCardSection({ currentUser, label, text, type, currentUserOwnsProfile }: InfoCardSectionProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const pRef = useRef<HTMLParagraphElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);

    const handleValueClick = () => {
        if (pRef.current && inputRef.current && labelRef.current && currentUserOwnsProfile) {
            pRef.current.style.display = "none";
            inputRef.current.style.display = "flex";
            inputRef.current.style.flexDirection = "row";
            inputRef.current.style.width = "100%";
            labelRef.current.style.display = "flex";
            labelRef.current.style.flexDirection = "row";
            labelRef.current.style.width = "100%";

            inputRef.current.focus();
            inputRef.current.select();
        }
    };

    const handleBlur = async () => {
        if (pRef.current && inputRef.current && labelRef.current && currentUserOwnsProfile && currentUser) {
            inputRef.current.style.display = "none";
            pRef.current.style.display = "inline";
            labelRef.current.style.display = "inline";

            const questionType = inputRef.current.name;
            const questionAnswer = inputRef.current.value;
            
            await ActionUserUpdateInfoQuestions(currentUser.uid, questionType as InfoCardTypes, questionAnswer);
            pRef.current.innerText = questionAnswer;
        }
    };

    const handleInputChange = async () => {
        if (inputRef.current && pRef.current && currentUserOwnsProfile && currentUser) {
            const questionType = inputRef.current.name;
            const questionAnswer = inputRef.current.value;
            
            await ActionUserUpdateInfoQuestions(currentUser.uid, questionType as InfoCardTypes, questionAnswer);
            pRef.current.innerText = questionAnswer;
        }
    };

    return (
        <div className="inline w-full text-sm">
            <p className="inline min-w-2 font-semibold mr-2" ref={labelRef}>{label}</p>
            <textarea
                ref={inputRef}
                className="hidden"
                name={type}
                defaultValue={text}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleInputChange();
                        inputRef.current?.blur();
                    }
                }}
            ></textarea>
            <p className="inline min-w-2" ref={pRef} onClick={handleValueClick}>{text}</p>
        </div>
    );
}