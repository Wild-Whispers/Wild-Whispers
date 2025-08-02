"use server";

import { WhisperTypes } from "@/_Enums/WhisperTypes";
import { User } from "@/_Interfaces/User";
import { WildMongo } from "wildmongowhispers";

export interface Paragraph {
    paragraph: string
}

/**
 * 
 * @param {string} uid ID of the user creating the post
 * @param {string} paragraphsRaw The text body of the post
 * @param {Array<string>} insertedMediaIDs An array of IDs for each of the media elements uploaded alongside the post. It is recommended to upload initially with a blank array and then update later as needed.
 * @param {WhisperTypes} whisperType The type of post - Post, Comment, Reply, etc
 * @param {string | null} whisperID The whisperID (post ID) associated with the post (if WhisperType is anything other than WhisperTypes.POST, otherwise this should be null)
 * @returns {Promise<string | null>} Returns the post ID (whisperID) of the inserted post upon success, or null upon failure.
 */
export default async function ActionCreatePost(user: User, paragraphsRaw: string, insertedMediaIDs: Array<string>, whisperType: WhisperTypes, whisperID: string | null): Promise<string | null> {
    console.info("[ActionCreatePost] Request Made");

    // Configure MongoDB
    const mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    const result = await mongo.insertOne("posts", {
        uid: user.uid,
        whisperID: whisperType === WhisperTypes.POST ? null : whisperID,
        whisperType: whisperType,
        paragraphs: paragraphsRaw,
        mediaIDs: insertedMediaIDs,
        timestamp: Date.now(),
        userImage: !user.image ? null : user.image._id === null ? null : user.image
    });

    await mongo.ClosePoolConnection();

    if (!result.acknowledged || !result.insertedId) {
        console.warn("Post could not be inserted:", result);
        return null;
    }

    return result.insertedId.toHexString();
}

