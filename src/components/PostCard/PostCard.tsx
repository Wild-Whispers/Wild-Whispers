"use client";

import TiledMediaContainer, { MediaTypes, TiledMedia } from "../Media/TiledMediaContainer";
import PostCardParagraph from "@/components/PostCard/PostCardParagraph";
import Card from "../Card";
import { User } from "@/_Interfaces/User";
import { WhisperTypes } from "@/_Enums/WhisperTypes";
import CreatePostContainer from "../PostCreation/CreatePostContainer";
import { UserMedia } from "@/_Interfaces/UserMedia";
import { Mimes } from "@/_Enums/Mimes";
import LazyLoadComments from "../Posts/LazyLoadComments";
import PostCardMetaMedium from "./PostCardMetaMedium";
import { Post } from "@/_Interfaces/Post";
import { useState } from "react";
import PostsComments from "../PostsComments/PostsComments";
import { useUser } from "@/_Contexts/User.context";

export default function PostCard({ whisper, whisperCreator, mediaRaw }: {whisper: Post, whisperCreator: User, mediaRaw: Array<UserMedia> }) {
    const { currentUser } = useUser();
    const [appendedPosts, updateAppendedPosts] = useState<Array<{ post: Post, mediaRaw: Array<UserMedia>}>>([]);

    const media: Array<TiledMedia> = mediaRaw.map(image => {
        let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

        return {
            type: (image.mimeType === Mimes.PNG || image.mimeType === Mimes.JPG || image.mimeType === Mimes.WEBP) ? MediaTypes.IMAGE : MediaTypes.VIDEO,
            src: API_BASE_URL + image.path,
            alt: image.altText
        }
    });

    return (
        <Card additionalClasses={[
            "flex-col",
            "w-full",
            "gap-2"
        ]}>
            <PostCardMetaMedium user={whisperCreator} timestamp={whisper.timestamp} userImage={whisper.userImage}/>
            <div className="flex flex-col">
                <TiledMediaContainer media={media} />
            </div>
            <div className="flex flex-col gap-2">
                <PostCardParagraph text={whisper.paragraphs}/>
            </div>
            <div className="flex flex-col gap-2">
                <div id={`post-comments-container-for-${whisper.whisperID}`} className="flex flex-col p-2 gap-4 rounded-sm bg-fuchsia-950/40">
                    {appendedPosts.map((post, i) => {
                        return <PostsComments
                                key={i}
                                whisper={post.post}
                                whisperCreator={currentUser! /* currentUser wouldn't *NOT* be defined if logic reaches this far, if it does, something is SERIOUSLY broken anyway */}
                                mediaRaw={post.mediaRaw}
                            />
                    })}
                    <LazyLoadComments forWhisperID={whisper.whisperID!} appendedCommentsCount={appendedPosts.length}/>
                </div>
            </div>
            <CreatePostContainer type={WhisperTypes.COMMENT} forWhisperID={whisper.whisperID} appendedPosts={appendedPosts} updateAppendedPosts={updateAppendedPosts}/>
        </Card>
    );
}