export const UserImageTypes = {
    REGULAR: "REGULAR",
    PROFILE_IMAGE: "PROFILE_IMAGE",
    PROFILE_BANNER: "PROFILE_BANNER"
} as const;

export type UserImageTypes = keyof typeof UserImageTypes;

export const validUserImageTypes = [
    "REGULAR",
    "PROFILE_IMAGE",
    "PROFILE_BANNER"
];