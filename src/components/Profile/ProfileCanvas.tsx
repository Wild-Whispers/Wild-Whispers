"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import isUserMedia, { UserMedia } from "@/_Interfaces/UserMedia";
import ProfileBannerSwapButton from "./ProfileBannerSwapButton";
import ProfileImageContainer from "./ProfileImageContainer";
import ProfileName from "./ProfileName";
import CardProfileSocial from "./Cards/CardProfileSocial";
import { useUser } from "@/_Contexts/User.context";
import isUser from "@/_Interfaces/User";

export default function ProfileCanvas() {
    const { user, currentUserOwnsProfile, setUser } = useUser();
    
    // User-related hooks
    const [username, setUsername] = useState("");
    const [banner, setBanner] = useState("/assets/placeholders/profilebanner.png");
    const [profileImage, setProfileImage] = useState("/assets/placeholders/profileimage.png");

    // Non-user-related hooks
    const [pageMessage, setPageMessage] = useState("");
    const [pageMessageClass, setPageMessageClass] = useState("success-text");

    useEffect(() => {
        if (isUser(user)) {
            document.title = currentUserOwnsProfile ? "Your Profile" : `${user.userName}'s Profile`;
            
            let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

            let image: UserMedia | undefined = user.image;
            let banner: UserMedia | undefined = user.banner;

            if (isUserMedia(image) && image.path) setProfileImage(API_BASE_URL + image.path);

            if (isUserMedia(banner) && banner.path) setBanner(API_BASE_URL + banner.path);
        }
    }, []);

    return (
        <>
            <p className={`text-md font-semibold text-center ${pageMessageClass}`}>{pageMessage}</p>
            <div
                className="
                    flex
                    flex-col
                    justify-center
                    items-center
                    p-1

                    w-full
                    h-75
                    rounded-4xl
                    bg-fuchsia-50/50
                ">
                <div
                    style={{ backgroundImage: `url(${banner})`}}
                    className="
                        relative
                        flex
                        flex-row
                        justify-between
                        items-end
                        w-full
                        h-full
                        p-5

                        rounded-4xl
                        bg-cover
                        bg-no-repeat
                        bg-center
                    ">
                    
                    <ProfileBannerSwapButton pageMessageUpdater={setPageMessage} pageMessageClassUpdater={setPageMessageClass} updateBanner={setBanner} />

                    <div className="flex flex-col justify-center items-center">
                        <ProfileImageContainer pageMessageUpdater={setPageMessage} pageMessageClassUpdater={setPageMessageClass} updateProfileImage={setProfileImage} />
                        <ProfileName>{username}</ProfileName>
                    </div>

                    {/* Found images here: https://icons8.com/icons/set/steam */}
                    <div className="flex flex-col justify-center items-center">
                        <CardProfileSocial>
                            <span className="flex flex-row justify-between items-center gap-3">
                                <img className="w-6 h-6" src="/assets/icons/discord.png"/>
                                <p className="text-xs">@quietwinduponthemoor</p>
                            </span>
                            <span className="flex flex-row justify-between items-center gap-3">
                                <img className="w-6 h-6" src="/assets/icons/github.png"/>
                                <Link className="text-xs hover:underline cursor-pointer" href="https://github.com/QuietWindUponTheMoor/">QuietWindUponTheMoor</Link>
                            </span>
                            <span className="flex flex-row justify-between items-center gap-3">
                                <img className="w-6 h-6" src="/assets/icons/steam.png"/>
                                <Link className="text-xs hover:underline cursor-pointer" href="https://s.team/p/208154581">Quiet Wind</Link>
                            </span>
                        </CardProfileSocial>
                    </div>

                </div>
            </div>
        </>
    );
}