"use server";

import { WildMongo } from "wildmongowhispers";

export default async function ActionUncreatePost(whisperID: string, uploadedMediaIDs: Array<string>) {
    console.info("[ActionUncreatePost] Request Made");

    // Configure MongoDB
    const mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    await mongo.deleteByID("posts", whisperID);

    for (const mediaID of uploadedMediaIDs) {
        await mongo.deleteByID("media", mediaID);
    }

    await mongo.ClosePoolConnection();
}