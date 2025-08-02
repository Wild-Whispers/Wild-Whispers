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

    let mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    const users = await mongo.find("accounts", {
        _id: {
            $in: batchInitializer.map((batch, i) => new ObjectId(batch.uid))
        }
    });

    await mongo.ClosePoolConnection();

    return users.map((user, i) => {

        return user;
    });
}


/*

const users = await Promise.all(
        batchInitializer.map(async (batchInitializer, i) => {
            const user = await mongo.findByID("accounts", batchInitializer.uid);

            delete user.password;
            delete user._id;

            return {
                user: user as User,
                whisperID: batchInitializer.whisperID
            };
        })
    );

    */