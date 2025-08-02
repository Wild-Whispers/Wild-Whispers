"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import isUser, { User } from "@/_Interfaces/User";
import isUserMedia, { UserMedia } from "@/_Interfaces/UserMedia";
import { ActionUserFetchProfileImage } from "@/_Actions/ActionUserFetchProfileImage";
import ActionImageCacheGet from "@/_Actions/ActionImageCacheGet";
import { UserImageTypes } from "@/_Enums/UserImageTypes";
import ActionImageCacheAdd from "@/_Actions/ActionImageCacheAdd";

export default function UserSmallImage({ user, onClick }: { user: User, onClick?: () => void }) {
    const [image, updateImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            // Try to fetch from cache first
            if (process.env.NODE_ENV === "production") {
                const cacheImages = await ActionImageCacheGet(user.uid, UserImageTypes.PROFILE_IMAGE);

                if (cacheImages.length > 0) {
                    updateImage(process.env.NEXT_PUBLIC_API_BASE_URL! + cacheImages[0].path);
                    return;
                }
            } else {
                console.warn("In development mode. Image cache will not be used.");
            }

            // Otherwise, fetch from database
            const result: UserMedia | undefined = await ActionUserFetchProfileImage(user.uid);

            if (isUserMedia(result)) {
                updateImage(process.env.NEXT_PUBLIC_API_BASE_URL! + result.path);

                // Add to cache for next time
                await ActionImageCacheAdd(user.uid, result);
            } else {
                console.warn("Not user media or cached image is no longer available:", result);
            }
        };

        if (isUser(user)) fetchImages();
    }, [user]);

    return (
        <div
            onClick={onClick ?? undefined}
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
                image ? 
                <Image
                    src={image}
                    alt={`${user.userName}'s Profile Image`}
                    width={512}
                    height={512}
                    className="
                        w-full
                        h-full
                        
                        rounded-lg
                "/> :
                <div className="flex justify-center items-center w-full h-full rounded-lg text-md font-semibold bg-sky-700">
                    <p className="text-md font-semibold select-none">{user.userName.charAt(0).toUpperCase()}</p>
                </div>
            }
        </div>
    );
}