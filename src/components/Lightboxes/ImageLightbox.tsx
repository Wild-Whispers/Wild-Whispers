"use client";

import Image from "next/image";
import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Buttons } from "../Buttons";
import { User } from "@/_Interfaces/User";

interface ImageLightboxProps {
    closeLightbox: () => void,
    src: string,
    alt: string,
    width: number,
    height: number,
    imageID: string,
    currentUserOwnsProfile: boolean,
    currentUser: User | undefined,
    user: User
}

export default function ImageLightbox({ closeLightbox, src, alt, width, height, imageID, currentUserOwnsProfile, currentUser, user }: ImageLightboxProps) {
    useEffect(() => {
        document.body.classList.add("lightbox-open");

        return () => {
            document.body.classList.remove("lightbox-open");
        }
    }, []);

    return (
        <div className="fixed flex flex-col justify-start items-center w-full h-full right-0 bottom-0 left-0 top-0 backdrop-blur-sm z-100 overflow-y-scroll">
            <div className="flex flex-col justify-start items-center w-full h-full">


                <div className="flex flex-row justify-between items-center top-0 w-full p-2 bg-indigo-950 gap-2">
                    {
                        currentUserOwnsProfile && (
                            <div className="flex flex-row gap-2">
                                <Buttons.Main>Set As Profile Image</Buttons.Main>
                                <Buttons.Main>Set As Profile Banner</Buttons.Main>
                            </div>
                        )
                    }
                    <XMarkIcon onClick={closeLightbox} className="flex flex-row justify-center items-center w-10 h-10 cursor-pointer hover:text-red-400" title="Close lightbox"/>
                </div>

                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className="
                        flex
                        max-w-3/4
                        mt-10
                    "
                />


            </div>
        </div>
    );
}