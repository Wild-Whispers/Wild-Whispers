import { WhisperTypes } from "@/_Enums/WhisperTypes";
import { ObjectId } from "bson";
import isUserMedia, { UserMedia } from "./UserMedia";

export interface Post {
    _id?: string | ObjectId,
    uid: string,
    whisperID: string | null,
    whisperType: WhisperTypes,
    paragraphs: string,
    mediaIDs: Array<string>,
    timestamp: number,
    userImage: UserMedia | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function isPost(value: any): value is Post {

    return (
        value &&
        typeof value === "object" &&
        (typeof value._id === "string" || !value._id) &&
        typeof value.uid === "string" &&
        (typeof value.whisperID === "string" || value.whisperID === null) &&
        typeof value.paragraphs === "string" &&
        typeof value.timestamp === "number" &&
        (
            Array.isArray(value.mediaIDs) &&
            value.mediaIDs.every((ID: unknown) => typeof ID === "string")
        ) &&
        (isUserMedia(value.userImage) || value.userImage === null)
    );
}