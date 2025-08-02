"use client";

import { UserImageTypes } from "@/_Enums/UserImageTypes";
import { PostMedia } from "@/_Interfaces/PostMedia";
import isUser, { User } from "@/_Interfaces/User";
import { allowedMimeTypes, MimeType } from "@/_Types/MimeType";
import { useRef } from "react";
import UserLargeImage from "../UserProfileImages/UserLargeImage";
import { useUser } from "@/_Contexts/User.context";
import { Mimes } from "@/_Enums/Mimes";
import RequestUploadMedia, { UploadMediaReturn } from "@/_Requests/RequestUploadMedia";
import isUserMedia from "@/_Interfaces/UserMedia";

interface _ProfileImageContainer {
    pageMessageUpdater: (newText: string) => void;
    pageMessageClassUpdater: (newText: string) => void;
    updateProfileImage: (newText: string) => void;
}

export default function ProfileImageContainer({ pageMessageUpdater, pageMessageClassUpdater, updateProfileImage }: _ProfileImageContainer) {
    const { currentUser, user, currentUserOwnsProfile, setCurrentUser } = useUser();
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isUser(currentUser) || !currentUserOwnsProfile) return;

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            pageMessageUpdater("Uploading, please wait...");
            pageMessageClassUpdater("");

            if (!allowedMimeTypes.includes(file.type as MimeType)) {
                pageMessageUpdater(`Unsupported file type '${file.type}'!`);
                pageMessageClassUpdater("error-text");
            }

            const whisperID = null;
            const whisperType = null;
            const newImageAlt = `${currentUser.userName}'s new profile image`;
            const media: PostMedia = {
                type: file.type as MimeType,
                file: file,
                name: file.name
            };
            
            const { success, insertedMedia, returnedUser }: UploadMediaReturn = await RequestUploadMedia(currentUser, UserImageTypes.PROFILE_IMAGE, whisperID, whisperType, media, newImageAlt);

            if (success && isUser(returnedUser) && isUserMedia(insertedMedia)) {
                const newUser = {
                    ...returnedUser,
                    image: insertedMedia
                };

                if (!isUser(newUser)) {
                    pageMessageUpdater("The new user object is malformed. This means there was a catastrophic error. Please report this to an administrator.");
                    pageMessageClassUpdater("error-text");
                }

                setCurrentUser(newUser);

                if (!insertedMedia.path) {
                    pageMessageUpdater("The image may have been uploaded, but the returned media object is malformed. Please try again, or contact an administrator.");
                    pageMessageClassUpdater("error-text");
                }

                updateProfileImage(API_BASE_URL + insertedMedia.path);

                if (isUser(newUser) && insertedMedia.path) {
                    pageMessageUpdater("Successfully uploaded image!");
                    pageMessageClassUpdater("success-text");

                }

                setTimeout(() => {
                    pageMessageUpdater("");
                    pageMessageClassUpdater("");
                }, 3000);
            } else {
                pageMessageUpdater("The returned user object or media object was malformed. Please try again, or contact an administrator.");
                pageMessageClassUpdater("error-text");

                setTimeout(() => {
                    pageMessageUpdater("");
                    pageMessageClassUpdater("");
                }, 3000);
            }
        }
    };

    const handleClick = () => {
        if (currentUserOwnsProfile) fileInputRef.current?.click();
    };

    return (
        <>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept={`${Mimes.PNG}, ${Mimes.JPG}, ${Mimes.WEBP}`} />
            <UserLargeImage user={currentUserOwnsProfile ? currentUser as User : user as User} onClick={handleClick}/>
        </>
    );
}