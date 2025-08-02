"use server";

import { InfoCardTypes } from "@/_Enums/InfoCardTypes";
import { WildMongo } from "wildmongowhispers";

export async function ActionUserUpdateInfoQuestions(uid: string, questionType: InfoCardTypes, answer: string) {
    console.info("[ActionUserUpdateInfoQuestions] Request Made");

    // Configure MongoDB
    const mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    await mongo.database.collection("user-info").updateOne(
        { uid },
        {
            $set: {
                "questions.$[elem].answer": answer
            }
        },
        {
            arrayFilters: [
                { "elem.type": questionType }
            ]
        }
    );

    await mongo.ClosePoolConnection();
}