"use client";

import { User } from "@/_Interfaces/User";
import { UserMedia } from "@/_Interfaces/UserMedia";
import UserExtraSmallImage from "../UserProfileImages/NonCacheable/UserExtraSmallImage";
import HelperFormatUnixTimestamp from "@/_Helpers/HelperFormatUnixTimestamp";

export default function PostCardMetaSmall({ user, timestamp, userImage, }: { user: User, timestamp: number, userImage: UserMedia | null }) {
    return (
        <div className="flex flex-row justify-start items-center gap-1">
            <UserExtraSmallImage image={userImage} userNameFirstChar={user.userName.charAt(0)}/>
            <h3 className="text-sm font-semibold before:content-['•_'] before:text-slate-50/60">{user.userName} commented</h3>
            <p className="text-xs font-semibold text-slate-50/80 before:content-['•_'] before:text-slate-50/60">{HelperFormatUnixTimestamp(timestamp)}</p>
        </div>
    );
}