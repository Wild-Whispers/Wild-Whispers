"use server";

import { UserImageTypes } from "@/_Enums/UserImageTypes";
import { User } from "@/_Interfaces/User";
import { WildMongo } from "wildmongowhispers";

/**
 * 
 * @deprecated This function is deprecated. Please use ActionUserBatchFetch instead.
 */
export async function ActionUserFetchByID(uid: string): Promise<User | undefined> {
    console.info("[ActionUserFetchByID] Request Made");

    // Configure MongoDB
    const mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    try {

        const userRaw = await mongo.findByID("accounts", uid);
        const mediaRaw = await mongo.find("media", { uid });
        const socialsRaw = await mongo.find("user-socials", { uid });
        const [infoRaw] = await mongo.find("user-info", { uid });

        if (!userRaw) {
            console.warn(`No user could be found with the uid '${uid}'.`);
            return undefined;
        }

        // Strip unneccessary properties
        delete userRaw.password;
        delete userRaw._id;

        const userImage = {
            ...mediaRaw.find(img => img.imageType === UserImageTypes.PROFILE_IMAGE) ?? null,
            _id: null
        };

        const userBanner = {
            ...mediaRaw.find(img => img.imageType === UserImageTypes.PROFILE_BANNER) ?? null,
            _id: null
        };

        const finalizedUser = {
            ...userRaw,
            uid: uid,
            image: userImage,
            banner: userBanner,
            userData: {
                socials: stripMongoIDs(socialsRaw),
                info: !infoRaw ? null : infoRaw.questions,
                bio: !infoRaw ? "" : infoRaw.bio
            }
        };

        await mongo.ClosePoolConnection();

        return finalizedUser;
    } catch (error) {
        console.error("Fetch user by ID error:", error);
        await mongo.ClosePoolConnection();
        return undefined;
    }
}

function stripMongoIDs<T extends { _id?: unknown }>(array: T[]): Omit<T, "_id">[] {
    return array.map((item) => {
        const { _id: _, ...rest } = item;
        return rest;
    });
}