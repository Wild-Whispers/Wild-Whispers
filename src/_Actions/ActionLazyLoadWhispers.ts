"use server";

import { WhisperTypes } from "@/_Enums/WhisperTypes";
import { Post } from "@/_Interfaces/Post";
import { User } from "@/_Interfaces/User";
import { UserMedia } from "@/_Interfaces/UserMedia";
import { ObjectId } from "bson";
import { WildMongo } from "wildmongowhispers";
import { ActionUserBatchFetch, UserBatchInitializer } from "./ActionUserBatchFetch";

export interface ActionLazyLoadPostsReturn {
    post: Post,
    creator: User,
    media: Array<UserMedia>
}

export default async function ActionLazyLoadWhispers(whisperType: WhisperTypes, skip: number, limit: number = 20, uid: string | null = null, forWhisperID: string | null = null): Promise<Array<ActionLazyLoadPostsReturn>> {
    console.info("[ActionLazyLoadWhispers] Request Made");

    // Configure MongoDB
    const mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    let result: Array<Post> = [];
    if (!uid && !forWhisperID) {
        result = await mongo.database.collection<Post>("posts")
            .find({ whisperType })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
    }
    
    else if (uid && !forWhisperID) {
        result = await mongo.database.collection<Post>("posts")
            .find({ uid, whisperType })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
    }

    else if (forWhisperID) {
        result = await mongo.database.collection<Post>("posts")
            .find({ whisperID: forWhisperID, whisperType })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
    }

    // Fetch all of the user objects relevant to the posts
    const batchInitializer: Array<UserBatchInitializer> = result.map(whisper => { // Will result in duplicates, but should overall complete faster
        return {
            whisperID: (whisper._id as ObjectId).toHexString(),
            uid: whisper.uid
        };
    });


    const batchedUsers: Array<User> = await ActionUserBatchFetch(batchInitializer);

    const posts: Array<ActionLazyLoadPostsReturn> = await Promise.all(
        result.map(async item => {
            const creator: User = {
                ...batchedUsers.find((user: User) => user._id.toHexString() === item.uid)!,
                _id: null
            };

            const media = await Promise.all(
                item.mediaIDs.map(async mediaID => {
                    const media = await mongo.findByID("media", mediaID);

                    return {
                        ...media,
                        _id: null,
                        mediaID: mediaID
                    } as UserMedia;
                })
            );

            return {
                post: {
                    ...item,
                    _id: (item._id as ObjectId).toHexString(),
                    whisperID: (item._id as ObjectId).toHexString()
                } as Post,
                creator: creator,
                media: media
            };
        })
    );

    await mongo.ClosePoolConnection();

    return posts;
}