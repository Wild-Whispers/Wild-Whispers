"use client";

import { useEffect, useState } from "react";
import PostCard from "../PostCard/PostCard";
import { User } from "@/_Interfaces/User";
import Card from "../Card";
import { useUser } from "@/_Contexts/User.context";
import ActionLazyLoadWhispers, { ActionLazyLoadPostsReturn } from "@/_Actions/ActionLazyLoadWhispers";
import { WhisperTypes } from "@/_Enums/WhisperTypes";
import SkeletonLineMultiple from "../SkeletonLoader/SkeletonLineMultiple";

export default function LazyLoadPosts({ user, appendedPostsCount }: { user: User, appendedPostsCount: number }) {
    const { currentUserOwnsProfile } = useUser();
    const [ready, setReady] = useState(false);
    const [posts, setPosts] = useState<Array<ActionLazyLoadPostsReturn>>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [postsSkip, setPostsSkip] = useState(0);
    const postsLimit = 20;

    useEffect(() => {
        const fetchPosts = async () => {
            const initialPosts: Array<ActionLazyLoadPostsReturn> = await ActionLazyLoadWhispers(WhisperTypes.POST, postsSkip, postsLimit, user.uid);
            setPosts(initialPosts);
            setReady(true);
        };

        if (!ready) fetchPosts();
    }, [user.uid, postsSkip, ready]);

    if (!ready) return <SkeletonLineMultiple styling="" lineCount={5}/>

    if (posts.length === 0 && appendedPostsCount === 0) {
        return (
            <Card additionalClasses={[
                    "flex-col",
                    "w-full"
                ]}>
                    <p className="text-sm font-semibold">{currentUserOwnsProfile ? "You have" : `${user.userName} has`} no public whispers.</p>
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