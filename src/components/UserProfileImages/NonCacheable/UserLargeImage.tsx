"use client";

import Image from "next/image";
import isUserMedia, { UserMedia } from "@/_Interfaces/UserMedia";

export default function UserLargeImage({ image, userNameFirstChar }: { image: UserMedia | null, userNameFirstChar?: string }) {
    return (
        <div
            className="
            flex
            flex-col
            w-30
            h-30
            p-1

            bg-fuchsia-50/90
            rounded-4xl
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
                        
                        rounded-4xl
                "/> :
                <div className="flex justify-center items-center w-full h-full rounded-4xl bg-sky-700">
                    <p className="text-7xl font-semibold select-none">{userNameFirstChar}</p>
                </div>
            }
        </div>
    );
}