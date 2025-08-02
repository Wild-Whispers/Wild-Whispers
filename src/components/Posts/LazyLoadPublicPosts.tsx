"use client";

import { useEffect, useState } from "react";
import PostCard from "../PostCard/PostCard";
import Card from "../Card";
import ActionLazyLoadWhispers, { ActionLazyLoadPostsReturn } from "@/_Actions/ActionLazyLoadWhispers";
import { WhisperTypes } from "@/_Enums/WhisperTypes";
import SkeletonLineMultiple from "../SkeletonLoader/SkeletonLineMultiple";

export default function LazyLoadPublicPosts({ appendedPostsCount }: { appendedPostsCount: number }) {
    const [ready, setReady] = useState(false);
    const [posts, setPosts] = useState<Array<ActionLazyLoadPostsReturn>>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [postsSkip, setPostsSkip] = useState(0);
    const postsLimit = 20;

    useEffect(() => {
        const fetchPosts = async () => {
            const uidToFetch = null; // Since the uid is unneeded here
            const initialPosts: Array<ActionLazyLoadPostsReturn> = await ActionLazyLoadWhispers(WhisperTypes.POST, postsSkip, postsLimit, uidToFetch);
            setPosts(initialPosts);
            setReady(true);
        };

        if (!ready) fetchPosts();
    }, [postsSkip, ready]);

    if (!ready) return <SkeletonLineMultiple styling="" lineCount={5}/>

    if (posts.length === 0 && appendedPostsCount === 0) {
        return (
            <Card additionalClasses={[
                    "flex-col",
                    "w-full"
                ]}>
                    <p className="text-sm font-semibold">Wild Whispers is either empty of whispers, or something went terribly wrong. :(</p>
            </Card>
        );
    }

    return (
        <>
            {
                posts.map((post, i) => (
                    <PostCard
                        key={i}
                        whisper={post.post}
                        whisperCreator={post.creator}
                        mediaRaw={post.media}
                    />
                ))
            }
        </>
    );
}