"use server";

import { UserImageTypes } from "@/_Enums/UserImageTypes";
import { UserMedia } from "@/_Interfaces/UserMedia";
import { WildMongo } from "wildmongowhispers";

/**
 * @deprecated This interface is deprecated. Please use `UserMedia` or `PostMedia` instead.
 */
export interface UserImageRecord {
    imageID: string,
    uid: string,
    type: UserImageTypes,
    uploadedAt: number,
    path: string
}

export async function ActionUserFetchProfileImage(uid: string): Promise<UserMedia | undefined> {
    console.info("[ActionUserFetchProfileImage] Request Made");

    // Configure MongoDB
    const mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    const [image] = await mongo.find("media", { uid: uid, imageType: UserImageTypes.PROFILE_IMAGE });

    await mongo.ClosePoolConnection();

    if (image) delete image._id;

    return image;
}