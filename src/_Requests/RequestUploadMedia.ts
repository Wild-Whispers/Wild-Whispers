"use client";

import { UserImageTypes } from "@/_Enums/UserImageTypes";
import { PostMedia } from "@/_Interfaces/PostMedia";
import isUser, { User } from "@/_Interfaces/User";
import RequestNewAccessToken from "./RequestNewAccessToken";
import { WhisperTypes } from "@/_Enums/WhisperTypes";
import { UserMedia } from "@/_Interfaces/UserMedia";

export interface UploadMediaReturn {
    success: boolean,
    insertedMedia?: UserMedia,
    returnedUser?: User
}

/* eslint-disable @next/next/no-async-client-component */
export default async function RequestUploadMedia(
    user: User,
    imageType: UserImageTypes,
    whisperID: string | null,
    whisperType: WhisperTypes | null,
    media: PostMedia,
    altText=""
): Promise<UploadMediaReturn> {
    
    const formData = new FormData();
    formData.append("file", media.file);
    formData.append("uid", user.uid);
    formData.append("altText", altText);
    formData.append("imageType", imageType);
    formData.append("whisperType", whisperType ?? "");
    formData.append("whisperID", whisperID ?? "");

    // Fetch a new access token
    let newUser = await RequestNewAccessToken(user);

    if (!newUser || !isUser(newUser)) {
        console.error("Unable to get access token, or the returned user object was malformed! Please try again or contact an administrator.");

        return {
            success: false
        };
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

    const response = await fetch(API_BASE_URL + "/post/files/media/upload/", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${newUser.tokens!.accessToken}`,
        },
        body: formData,
    });

    const result = await response.json();

    newUser = {
        ...newUser,
        tokens: {
            accessToken: "",
            refreshToken: newUser.tokens!.refreshToken
        }
    };

    if (response.ok) {
        const insertedMediaID = result.payload.insertedMediaID;
        const insertedMedia = result.payload.insertedOMedia;

        return {
            success: true,
            insertedMedia: {
                ...insertedMedia,
                mediaID: insertedMediaID
            },
            returnedUser: newUser
        };
    } else {
        console.error(result.message);

        return {
            success: false
        };
    }
}