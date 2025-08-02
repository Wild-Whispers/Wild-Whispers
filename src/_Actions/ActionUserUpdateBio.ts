"use server";

import { WildMongo } from "wildmongowhispers";

export async function ActionUserUpdateBio(uid: string, bio: string) {
    console.info("[ActionUserUpdateBio] Request Made");

    // Configure MongoDB
    const mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    await mongo.findOneAndUpdate(
        "user-info",
        { uid },
        {
            $set: {
                bio: bio
            }
        },
        true
    );

    await mongo.ClosePoolConnection();
}