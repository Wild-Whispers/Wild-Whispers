"use server";

import { Mimes } from "@/_Enums/Mimes";
import { UserImageTypes } from "@/_Enums/UserImageTypes";
import { UserMedia } from "@/_Interfaces/UserMedia";
import { WildMongo } from "wildmongowhispers";

/**
 * @deprecated This interface is deprecated. Use `UseMedia` instead.
 */
export interface UserImageRecord {
    imageID: string,
    uid: string,
    type: UserImageTypes,
    uploadedAt: number,
    path: string
}

export async function ActionUserFetchImages(uid: string): Promise<Array<UserMedia>> {
    console.info("[ActionUserFetchImages] Request Made");

    // Configure MongoDB
    const mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    const imagesResult = await mongo.find("media",
        {
            uid,
            mimeType: {
                $in: [
                    Mimes.JPG,
                    Mimes.PNG,
                    Mimes.WEBP
                ]
            }
        });

    await mongo.ClosePoolConnection();

    const images: Array<UserMedia> = [];

    for (const record of imagesResult) {
        images.push({
            mediaID: record._id.toString(),
            uid: record.uid,
            altText: record.altText,
            imageType: record.imageType,
            mimeType: record.mimeType,
            path: record.path,
            timestamp: record.timestamp,
            whisperType: record.whisperType,
            whisperID: record.whisperID
        });
    }

    return images;
}