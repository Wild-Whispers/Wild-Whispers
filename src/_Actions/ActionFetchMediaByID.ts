"use server";

import { WildMongo } from "wildmongowhispers";

export default async function ActionFetchMediaByID(mediaID: string) {
    console.info("[ActionFetchMediaByID] Request Made");

    // Configure MongoDB
    let mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    let result = await mongo.findByID("media", mediaID);

    await mongo.ClosePoolConnection();

    return result;
}