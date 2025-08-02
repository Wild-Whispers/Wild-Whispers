"use server";

import { UserImageTypes } from "@/_Enums/UserImageTypes";
import isUserMedia, { UserMedia } from "@/_Interfaces/UserMedia";
import { createClient } from "redis";

let redis = createClient({url: process.env.NEXT_REDIS_URI});
await redis.connect();

export default async function ActionImageCacheGet(uid: string, imageType: UserImageTypes): Promise<Array<UserMedia>> {
    console.info("[ActionImageCacheGet] Request Made");

    const result = await redis.sMembers(`imageCache:${uid}`);

    let images: Array<UserMedia | undefined> = [];
    if (result.length > 0) {
        images = result.map(image => {
            try {
                let img = JSON.parse(image);
                if (isUserMedia(img)) {
                    return img;
                }

                console.warn("Image cache item is not a valid UserMedia object:", image);
            } catch (error) {
                console.warn("Image cache item is not a parsable JSON object:", image);
            }
        });
    }

    return images.filter(
        (image): image is UserMedia =>
            image != null &&
            image.imageType === imageType
    );
}