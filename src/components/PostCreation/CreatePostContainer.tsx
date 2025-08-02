"use client";

import { Dispatch, KeyboardEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { useUser } from "@/_Contexts/User.context";
import { WhisperTypes } from "@/_Enums/WhisperTypes";
import ActionCreatePost from "@/_Actions/ActionCreatePost";
import { flushSync } from "react-dom";
import Card from "../Card";
import TextArea from "../Forms/Inputs/TextArea";
import PostDropdownAttachmentCamera from "./PostDropdownAttachmentCamera";
import PostDropdownAttachmentVideo from "./PostDropdownAttachmentVideo";
import PostDropdownTriggerMinus from "./PostDropdownTriggerMinus";
import PostDropdownTriggerPlus from "./PostDropdownTriggerPlus";
import UserSmallImage from "../UserProfileImages/UserSmallImage";
import { Mimes } from "@/_Enums/Mimes";
import RequestUploadMedia, { UploadMediaReturn } from "@/_Requests/RequestUploadMedia";
import isUser, { User } from "@/_Interfaces/User";
import { UserImageTypes } from "@/_Enums/UserImageTypes";
import { PostMedia } from "@/_Interfaces/PostMedia";
import { MimeType } from "@/_Types/MimeType";
import ActionUncreatePost from "@/_Actions/ActionUncreatePost";
import ActionCreatePostSetMedia, { ActionCreatePostSetMediaResult } from "@/_Actions/ActionCreatePostSetMedia";
import isUserMedia, { UserMedia } from "@/_Interfaces/UserMedia";
import { Post } from "@/_Interfaces/Post";

export default function CreatePostContainer({ type, forWhisperID = null, appendedPosts, updateAppendedPosts }: { type: WhisperTypes, forWhisperID?: string | null, appendedPosts: Array<{ post: Post, mediaRaw: Array<UserMedia>}>, updateAppendedPosts: Dispatch<SetStateAction<Array<{ post: Post, mediaRaw: Array<UserMedia> }>>> }) {
    const { currentUser, setCurrentUser } = useUser();

    if (!isUser(currentUser)) return;

    const [textValue, updateValue] = useState("");
    const [dropdownActive, setDropdownActive] = useState(false);
    const [response, updateResponse] = useState<null | string>(null);
    const [responseClass, updateResponseClass] = useState("");
    const attachmentsDropdown = useRef<HTMLDivElement>(null);
    const input = useRef<HTMLTextAreaElement>(null);
    const imagesInput = useRef<HTMLInputElement>(null);
    const videosInput = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<Array<File>>([]);
    const uploadedMediaIDs: Array<string> = [];
    const uploadedMedia: Array<UserMedia> = [];

    const toggleAttachmentsDropdown = () => {
        if (attachmentsDropdown.current) {
            let dropdown = attachmentsDropdown.current;

            dropdown.classList.toggle("show");
            
            if (dropdown.classList.contains("show")) {
                setDropdownActive(true);
            } else {
                setDropdownActive(false);
            }
        }
    };

    const handleSetFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFileTotal = e.target.files.length + files.length;

            if (newFileTotal > 10) {
                updateResponse(`The maximum amount of files has been reached! (${newFileTotal}/10) Please try again.`);
                updateResponseClass("warn-text");
                setFiles([]);
                return;
            }
            
            files.push(...e.target.files);
            setFiles(files);
        }
    };

    const handlePostSubmit = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (!textValue || textValue.trim().length === 0) return;
            if (!isUser(currentUser)) return; // Just in case

            // Submit post
            let whisperID: string | null = await ActionCreatePost(currentUser, textValue, [], type, forWhisperID);

            if (!whisperID) {
                updateResponse("Could not submit post. Please try again or contact an administrator.");
                updateResponseClass("error-text");
                return;
            }

            // Upload media
            let workingUser: User = currentUser;
            for (let file of files) {
                let media: PostMedia = {
                    type: file.type as MimeType,
                    file: file,
                    name: file.name
                };

                let { success, insertedMedia, returnedUser }: UploadMediaReturn = await RequestUploadMedia(
                    workingUser,
                    UserImageTypes.REGULAR, // Remains blank if not an image
                    whisperID,
                    WhisperTypes.POST,
                    media,
                    `Attached image for post #${whisperID}`
                );

                if (success && isUser(returnedUser) && isUserMedia(insertedMedia)) {
                    let newUser = {
                        ...returnedUser,
                        image: insertedMedia
                    };

                    if (!isUser(newUser)) {
                        updateResponse("The new user object is malformed. This means there was a catastrophic error. Please report this to an administrator.");
                        updateResponseClass("error-text");

                        // Reverse the post creation
                        await ActionUncreatePost(whisperID, uploadedMediaIDs);
                        return;
                    }

                    workingUser = newUser;
                    setCurrentUser(newUser);

                    if (!insertedMedia.mediaID) {
                        updateResponse("The image may have been uploaded, but the returned media object is malformed. Please try again, or contact an administrator.");
                        updateResponseClass("error-text");

                        // Reverse the post creation
                        await ActionUncreatePost(whisperID, uploadedMediaIDs);
                        return;
                    }

                    uploadedMediaIDs.push(insertedMedia.mediaID);
                    uploadedMedia.push(insertedMedia);
                }
            }

            // Finally, update the post with the media
            let { success, post }: ActionCreatePostSetMediaResult = await ActionCreatePostSetMedia(whisperID, uploadedMediaIDs);

            if (!success) {
                updateResponse("The image may have been uploaded, but the media could not be set for the post. Please try again, or contact an administrator.");
                updateResponseClass("error-text");

                // Reverse the post creation
                await ActionUncreatePost(whisperID, uploadedMediaIDs);
                return;
            }

            // Success sequence
            updateAppendedPosts((prev: Array<{ post: Post, mediaRaw: Array<UserMedia> }>) => [
                ...prev,
                {
                    post: post!,
                    mediaRaw: uploadedMedia
                }
            ]);
            updateResponse(`${type === WhisperTypes.POST ? "Post" : type === WhisperTypes.COMMENT ? "Comment" : "Reply"} submitted!`);
            updateResponseClass("success-text");

            setTimeout(() => {
                flushSync(() => updateValue(""));
                flushSync(() => updateResponse(null));
                flushSync(() => updateResponseClass(""));
            }, 3000);
        }
    };

    const handleImagesClick = () => {
        imagesInput.current?.click();
    };

    const handleVideosClick = () => {
        videosInput.current?.click();
    };

    return (
        <Card additionalClasses={["flex-col", "w-full", "gap-2"]}>
            <p className={`text-sm font-semibold bg-fuchsia-950/40 rounded-xl p-1 text-center ${!response ? responseClass + "hidden" : responseClass}`}>{response}</p>
            <div className="flex flex-row justify-start items-center gap-2">
                <UserSmallImage user={currentUser} />
                <TextArea ref={input} value={textValue} valueUpdater={updateValue} onKeyDown={handlePostSubmit} minLength={5} maxLength={2000}/>
                {dropdownActive && (<PostDropdownTriggerMinus onClick={toggleAttachmentsDropdown}/>)}
                {!dropdownActive && (<PostDropdownTriggerPlus onClick={toggleAttachmentsDropdown} />)}
            </div>
            <div ref={attachmentsDropdown} className="attachments-dropdown">
                <input ref={imagesInput} type="file" className="hidden" accept={`${Mimes.PNG}, ${Mimes.JPG}, ${Mimes.WEBP}`} onChange={handleSetFiles} multiple />
                <input ref={videosInput} type="file" className="hidden" accept={`${Mimes.MP4}, ${Mimes.WEBM},`} onChange={handleSetFiles} multiple />
                <PostDropdownAttachmentCamera clickHandler={handleImagesClick}/>
                <PostDropdownAttachmentVideo clickHandler={handleVideosClick}/>
            </div>
        </Card>
    );
}