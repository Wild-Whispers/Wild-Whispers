import { validMimes } from "@/_Enums/Mimes";
import { MimeType } from "@/_Types/MimeType";

export interface PostMedia {
    type: MimeType,
    file: File,
    name: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function isPostMedia(value: any): value is PostMedia {
    return (
        value &&
        typeof value === "object" &&
        validMimes.includes(value.type) &&
        typeof value.name === "string" &&
        typeof value.file !== "undefined" && value.file instanceof File
    );
}