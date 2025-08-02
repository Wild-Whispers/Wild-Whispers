import { _0Auth2Tokens } from "./_0Auth2Tokens";
import { UserData } from "./UserData";
import isUserMedia, { UserMedia } from "./UserMedia";

export interface User {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: any | null | undefined,
    uid: string,
    image?: UserMedia,
    banner?: UserMedia,
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    discord: string,
    userData?: UserData,
    tokens?: _0Auth2Tokens
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function isUser(value: any): value is User {
    return (
        value &&
        typeof value === "object" &&
        typeof value.uid === "string" &&
        (isUserMedia(value.image) || value.image._id === null || !value.image) &&
        (isUserMedia(value.banner) || value.banner._id === null || !value.banner) &&
        typeof value.userName === "string" &&
        typeof value.firstName === "string" &&
        typeof value.lastName === "string" &&
        typeof value.email === "string" &&
        typeof value.discord === "string" &&
        (typeof value.userData === "object" || !value.userData) && // Some versions of User may not have userData
        (
            value.tokens === undefined ||
            !value.tokens ||
            (typeof value.tokens === "object" && value.tokens !== null)
        )
    );
}