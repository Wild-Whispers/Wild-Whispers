"use client";

import Image from "next/image";
import isUserMedia, { UserMedia } from "@/_Interfaces/UserMedia";

export default function UserMediumImage({ image, userNameFirstChar }: { image: UserMedia | null, userNameFirstChar?: string }) {
    return (
        <div
            className="
            flex
            flex-col
            w-15
            h-15
            p-1

            bg-fuchsia-50/90
            rounded-2xl
        ">
            {
                isUserMedia(image) ? 
                <Image
                    src={process.env.NEXT_PUBLIC_API_BASE_URL! + image.path}
                    alt={image.altText}
                    width={1024}
                    height={1024}
                    className="
                        w-full
                        h-full
                        
                        rounded-xl
                    "/> :
                <div className="flex justify-center items-center w-full h-full rounded-2xl text-6xl font-semibold bg-sky-700">
                    <p className="text-xl font-semibold select-none">{userNameFirstChar}</p>
                </div>
            }
        </div>
    );
}