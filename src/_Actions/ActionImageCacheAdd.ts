"use server";

import isUserMedia, { UserMedia } from "@/_Interfaces/UserMedia";
import { createClient } from "redis";

const redis = createClient({url: process.env.NEXT_REDIS_URI});
await redis.connect();

export default async function ActionImageCacheAdd(uid: string, media: UserMedia): Promise<number | null> {
    console.info("[ActionImageCacheAdd] Request Made");

    let stringified = "";
    try {
        if (!isUserMedia(media)) throw new Error("Media is not of type `UserMedia`:", media);

        stringified = JSON.stringify(media);
    } catch (error) {
        console.error("Could not stringify media object:", error);
        return null;
    }
    
    if (!stringified) {
        console.warn("Media object could not be stringified:", stringified);
        return null;
    }

    const result: number = await redis.sAdd(`imageCache:${uid}`, stringified);
    await redis.expire(`imageCache:${uid}`, 86400);

    return result;
}