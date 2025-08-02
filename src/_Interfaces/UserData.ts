import { UserInfoRecords, UserSocialsRecords } from "@/_Types/UserXRecords";

export interface UserData {
    socials: UserSocialsRecords,
    info: UserInfoRecords,
    bio: string
}