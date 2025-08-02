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
    let mongo = new WildMongo("WildWhispers", process.env.NEXT_MONGO_URI!);

    try {

        let userRaw = await mongo.findByID("accounts", uid);
        let mediaRaw = await mongo.find("media", { uid });
        let socialsRaw = await mongo.find("user-socials", { uid });
        let [infoRaw] = await mongo.find("user-info", { uid });

        if (!userRaw) {
            console.warn(`No user could be found with the uid '${uid}'.`);
            return undefined;
        }

        // Strip unneccessary properties
        delete userRaw.password;
        delete userRaw._id;

        let userImage = {
            ...mediaRaw.find(img => img.imageType === UserImageTypes.PROFILE_IMAGE) ?? null,
            _id: null
        };

        let userBanner = {
            ...mediaRaw.find(img => img.imageType === UserImageTypes.PROFILE_BANNER) ?? null,
            _id: null
        };

        let finalizedUser = {
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

function stripMongoIDs<T extends Record<string, any>>(array: T[]): Omit<T, "_id">[] {
    return array.map(({ _id, ...rest }) => rest);
}


/*export async function FetchUserByID(uid: string): Promise<User | null> {
    try {
        let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

        let response = await fetch(API_BASE_URL + "/post/accounts/user/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: uid }),
        });

        let result = await response.json();

        if (response.ok) {
            return result.payload as User;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Fetch user by ID error:", error);
        return null;
    }
}*/