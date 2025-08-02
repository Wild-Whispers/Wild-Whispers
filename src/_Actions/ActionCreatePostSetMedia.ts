"use server";

import { WildMongo } from "wildmongowhispers";
import { ObjectId } from "bson";
import isPost, { Post } from "@/_Interfaces/Post";

export interface ActionCreatePostSetMediaResult {
    success: boolean,
    post?: Post
}

export default async function ActionCreatePostSetMedia(whisperID: string, mediaIDs: Array<string>): Promise<ActionCreatePostSetMediaResult> {
    console.info("[ActionCreatePostSetMedia] Request Made");

    // Configure MongoDB
    const mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    const result = await mongo.findOneAndUpdate(
        "posts",
        { _id: new ObjectId(whisperID) },
        {
            $set: {
                mediaIDs: mediaIDs
            }
        },
        false // Upsert bool
    );

    await mongo.ClosePoolConnection();

    const post = {
        ...result,
        _id: null
    };

    // Failure
    if (!isPost(post)) return {
        success: false
    }

    return {
        success: true,
        post: post
    }
}