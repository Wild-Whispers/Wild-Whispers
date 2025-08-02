import { validMimes } from "@/_Enums/Mimes";
import { UserImageTypes, validUserImageTypes } from "@/_Enums/UserImageTypes";
import { validWhisperTypes, WhisperTypes } from "@/_Enums/WhisperTypes";
import { MimeType } from "@/_Types/MimeType";

export interface UserMedia {
    _id?: null | string,
    mediaID: string,
    uid: string,
    altText: string,
    imageType: UserImageTypes, // Will be UserImageTypes.REGULAR if A) Not profile image or banner, or B) Not an image
    mimeType: MimeType,
    path: string,
    timestamp: number,
    whisperType: WhisperTypes,
    whisperID: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function isUserMedia(value: any): value is UserMedia {
    return (
        value &&
        typeof value === "object" &&
        (typeof value._id === "string" || value._id === null || !value._id) &&
        validMimes.includes(value.mimeType) &&
        (!("mediaID" in value) || typeof value.mediaID === "string" || !value.mediaID) &&
        typeof value.uid === "string" &&
        typeof value.altText === "string" &&
        validUserImageTypes.includes(value.imageType) &&
        typeof value.path === "string" &&
        typeof value.timestamp === "number" &&
        (validWhisperTypes.includes(value.whisperType) || value.whisperType === "") &&
        typeof value.whisperID === "string"
    );
}