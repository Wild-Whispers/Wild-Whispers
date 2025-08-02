"use server";

import { User } from "@/_Interfaces/User";
import { ObjectId } from "bson";
import { WildMongo } from "wildmongowhispers";

export interface UserBatchInitializer {
    whisperID: string,
    uid: string
}

export async function ActionUserBatchFetch(batchInitializer: Array<UserBatchInitializer>): Promise<Array<User>> {
    console.info("[ActionUserBatchFetch] Request Made");

    const mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    const users = await mongo.find("accounts", {
        _id: {
            $in: batchInitializer.map(batch => new ObjectId(batch.uid))
        }
    });

    await mongo.ClosePoolConnection();

    return users.map(user => {

        return user;
    });
}