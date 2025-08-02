"use client";

import { useUser } from "@/_Contexts/User.context";
import { Mimes } from "@/_Enums/Mimes";
import { UserImageTypes } from "@/_Enums/UserImageTypes";
import { PostMedia } from "@/_Interfaces/PostMedia";
import isUser from "@/_Interfaces/User";
import isUserMedia from "@/_Interfaces/UserMedia";
import RequestUploadMedia, { UploadMediaReturn } from "@/_Requests/RequestUploadMedia";
import { allowedMimeTypes, MimeType } from "@/_Types/MimeType";
import { useRef } from "react";

export interface ProfilePageMessageProps {
    pageMessageUpdater: (newText: string) => void;
    pageMessageClassUpdater: (newText: string) => void;
    updateBanner: (newText: string) => void;
}

export default function ProfileBannerSwapButton({ pageMessageUpdater, pageMessageClassUpdater, updateBanner }: ProfilePageMessageProps) {
    const { currentUser, currentUserOwnsProfile, setCurrentUser } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!currentUserOwnsProfile) return null;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isUser(currentUser) || !currentUserOwnsProfile) return;

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            pageMessageUpdater("Uploading, please wait...");
            pageMessageClassUpdater("");

            //let { status, message, textClass, imagePath }: ImageUploadResponse = await ImageUpload(setUser, file, user, UserImageTypes.PROFILE_BANNER);

            if (!allowedMimeTypes.includes(file.type as MimeType)) {
                pageMessageUpdater(`Unsupported file type '${file.type}'!`);
                pageMessageClassUpdater("error-text");
            }

            const whisperID = null;
            const whisperType = null;
            const newImageAlt = `${currentUser.userName}'s new banner image`;
            const media: PostMedia = {
                type: file.type as MimeType,
                file: file,
                name: file.name
            };
            
            const { success, insertedMedia, returnedUser }: UploadMediaReturn = await RequestUploadMedia(currentUser, UserImageTypes.PROFILE_BANNER, whisperID, whisperType, media, newImageAlt);

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
                
                updateBanner(API_BASE_URL + insertedMedia.path);

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
        fileInputRef.current?.click();
    };

    return (
        <>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept={`${Mimes.PNG}, ${Mimes.JPG}, ${Mimes.WEBP}`} />

            <div
                onClick={handleClick}
                title="Change your banner"
                className="absolute right-2 top-2 flex flex-col justify-center items-center w-10 h-10 rounded-full cursor-pointer bg-fuchsia-50 hover:bg-fuchsia-100 border-1 border-slate-300 shadow-md">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox ="0 0 24 24"
                    className="w-3/4 h-3/4 fill-fuchsia-600/20 hover:fill-fuchsia-400/80">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
            </div>
        </>
    );
}