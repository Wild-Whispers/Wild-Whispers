export enum WhisperTypes {
    POST = "POST", // Full/original post
    COMMENT = "COMMENT", // First-level comment
    REPLY = "REPLY" // A reply to a comment (second-level comment)
}

export const validWhisperTypes = [
    "POST",
    "COMMENT",
    "REPLY"
];