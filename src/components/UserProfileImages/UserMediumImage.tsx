"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ActionUserFetchProfileImage } from "@/_Actions/ActionUserFetchProfileImage";
import isUserMedia, { UserMedia } from "@/_Interfaces/UserMedia";
import isUser, { User } from "@/_Interfaces/User";
import ActionImageCacheGet from "@/_Actions/ActionImageCacheGet";
import { UserImageTypes } from "@/_Enums/UserImageTypes";
import ActionImageCacheAdd from "@/_Actions/ActionImageCacheAdd";

export default function UserMediumImage({ user, onClick }: { user: User, onClick?: () => void }) {
    const [image, updateImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            // Try to fetch from cache first
            if (process.env.NODE_ENV === "production") {
                let cacheImages = await ActionImageCacheGet(user.uid, UserImageTypes.PROFILE_IMAGE);

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
            w-15
            h-15
            p-1

            bg-fuchsia-50/90
            rounded-2xl
        ">
            {
                image ? 
                <Image
                    src={image}
                    alt={`${user.userName}'s Profile Image`}
                    width={1024}
                    height={1024}
                    className="
                        w-full
                        h-full
                        
                        rounded-xl
                    "/> :
                <div className="flex justify-center items-center w-full h-full rounded-2xl text-6xl font-semibold bg-sky-700">
                    <p className="text-xl font-semibold select-none">{user.userName.charAt(0).toUpperCase()}</p>
                </div>
            }
        </div>
    );
}