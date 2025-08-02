"use client";

import { useUser } from "@/_Contexts/User.context";
import { WhisperTypes } from "@/_Enums/WhisperTypes";
import { Post } from "@/_Interfaces/Post";
import isUser from "@/_Interfaces/User";
import { UserMedia } from "@/_Interfaces/UserMedia";
import Card from "@/components/Card";
import PostCard from "@/components/PostCard/PostCard";
import CreatePostContainer from "@/components/PostCreation/CreatePostContainer";
import LazyLoadPublicPosts from "@/components/Posts/LazyLoadPublicPosts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const { currentUser } = useUser();
    const [appendedPosts, updateAppendedPosts] = useState<Array<{ post: Post, mediaRaw: Array<UserMedia>}>>([]);
    const router = useRouter();

    useEffect(() => {
        if (!isUser(currentUser)) router.push("/account/signin");

        document.title = "Wild Whispers";
    }, [router, currentUser]);

    if (!isUser(currentUser)) return null;

    return (
        <div id="home-main-container-wrapper" className="flex flex-col justify-start align-center w-2/3 gap-2">


            <Card additionalClasses={["flex-col", "w-full"]}>
                <h3 className="text-lg font-bold">Recent Whispers</h3>
            </Card>

            <CreatePostContainer type={WhisperTypes.POST} updateAppendedPosts={updateAppendedPosts}/>

            {appendedPosts.map((post, i) => {
                return <PostCard
                            key={i}
                            whisper={post.post}
                            whisperCreator={currentUser! /* currentUser wouldn't *NOT* be defined if logic reaches this far, if it does, something is SERIOUSLY broken anyway */}
                            mediaRaw={post.mediaRaw}
                        />
            })}

            <LazyLoadPublicPosts appendedPostsCount={appendedPosts.length}/>


        </div>
    );
}
