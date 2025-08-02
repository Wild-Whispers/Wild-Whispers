"use client";

import Image from "next/image";
import isUserMedia, { UserMedia } from "@/_Interfaces/UserMedia";

export default function UserSmallImage({ image, userNameFirstChar }: { image: UserMedia | null, userNameFirstChar?: string }) {
    return (
        <div
            className="
            flex
            flex-col
            w-8
            h-8
            p-[2px]

            bg-fuchsia-50/90
            rounded-lg
        ">
            {
                isUserMedia(image) ? 
                <Image
                    src={process.env.NEXT_PUBLIC_API_BASE_URL! + image.path}
                    alt={image.altText}
                    width={512}
                    height={512}
                    className="
                        w-full
                        h-full
                        
                        rounded-lg
                "/> :
                <div className="flex justify-center items-center w-full h-full rounded-lg text-md font-semibold bg-sky-700">
                    <p className="text-md font-semibold select-none">{userNameFirstChar}</p>
                </div>
            }
        </div>
    );
}