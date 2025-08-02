"use client";

import { notFound } from "next/navigation";
import ProfileCanvas from "@/components/Profile/ProfileCanvas";
import CardProfileBio from "@/components/Profile/Cards/CardProfileBio";
import CardProfileInfo from "@/components/Profile/Cards/CardProfileInfo";
import CardProfileImages from "@/components/Profile/Cards/CardProfileImages";
import Card from "@/components/Card";
import { WhisperTypes } from "@/_Enums/WhisperTypes";
import { useUser } from "@/_Contexts/User.context";
import isUser from "@/_Interfaces/User";
import CreatePostContainer from "@/components/PostCreation/CreatePostContainer";
import LazyLoadPosts from "@/components/Posts/LazyLoadPosts";
import { useState } from "react";
import { Post } from "@/_Interfaces/Post";
import { UserMedia } from "@/_Interfaces/UserMedia";
import PostCard from "@/components/PostCard/PostCard";

export const dynamic = "force-dynamic";

export default function Profile() {
    const { currentUser, user, currentUserOwnsProfile } = useUser();
    const [appendedPosts, updateAppendedPosts] = useState<Array<{ post: Post, mediaRaw: Array<UserMedia>}>>([]);

    if (!isUser(user)) notFound();

    return (
        <>
            <ProfileCanvas/>

            <div id="profile-content" className="flex flex-row w-full gap-2">

                <div id="profile-left-hand-cards" className="flex flex-col w-3/8 justify-start items-center gap-2">
                    <CardProfileBio />

                    <CardProfileInfo />

                    <CardProfileImages />

                </div>

                <div id="profile-right-hand-cards" className="flex flex-col max-h-full w-5/8 justify-start items-center gap-2 h-300 max-h-300 overflow-y-scroll">

                    <Card additionalClasses={["flex-col", "w-full"]}>
                        <h3 className="text-lg font-bold">{currentUserOwnsProfile ? "Your" : `${user.userName}'s Public`} Whispers</h3>
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
                
                    <LazyLoadPosts user={user} appendedPostsCount={appendedPosts.length}/>

                </div>

            </div>
        </>
    );
}