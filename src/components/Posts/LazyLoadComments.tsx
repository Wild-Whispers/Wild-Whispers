"use client";

import { useEffect, useState } from "react";
import ActionLazyLoadWhispers, { ActionLazyLoadPostsReturn } from "@/_Actions/ActionLazyLoadWhispers";
import { WhisperTypes } from "@/_Enums/WhisperTypes";
import PostsComments from "../PostsComments/PostsComments";
import SkeletonLineMultiple from "../SkeletonLoader/SkeletonLineMultiple";

export default function LazyLoadComments({ forWhisperID, appendedCommentsCount }: { forWhisperID: string, appendedCommentsCount: number }) {
    const [ready, setReady] = useState(false);
    const [posts, setPosts] = useState<Array<ActionLazyLoadPostsReturn>>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [postsSkip, setPostsSkip] = useState(0);
    const postsLimit = 20;

    useEffect(() => {
        const fetchPosts = async () => {
            const uidToFetch = null; // Since the uid is unneeded here
            const initialPosts: Array<ActionLazyLoadPostsReturn> = await ActionLazyLoadWhispers(WhisperTypes.COMMENT, postsSkip, postsLimit, uidToFetch, forWhisperID);
            setPosts(initialPosts);
            setReady(true);
        };

        if (!ready) fetchPosts();
    }, [forWhisperID, postsSkip, ready]);

    if (!ready) return <SkeletonLineMultiple styling="" lineCount={3}/>

    if (posts.length === 0 && appendedCommentsCount === 0) {
        return <p className="text-xs font-semibold text-center">This whisper has no comments. Be the first!</p>
    };

    return (
        <>
            {
                posts.map((post, i) => <PostsComments key={i} whisper={post.post} whisperCreator={post.creator} mediaRaw={post.media} />)
            }
        </>
    );
}