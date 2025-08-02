"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ImageLightbox from "@/components/Lightboxes/ImageLightbox";
import { ActionUserFetchImages } from "@/_Actions/ActionUserFetchImages";
import Card from "@/components/Card";
import { UserMedia } from "@/_Interfaces/UserMedia";
import { useUser } from "@/_Contexts/User.context";

export default function CardProfileImages() {
    const { currentUser, user, currentUserOwnsProfile, setCurrentUser, setUser, uidFromURL } = useUser();
    if (!user) return;

    const [images, updateImages] = useState<Array<UserMedia>>([]);
    const [showLightbox, setShowLightbox] = useState(false);
    const [activeLightboxSrc, setActiveLightboxSrc] = useState("");
    const [activeLightboxImageID, setActiveLightboxImageID] = useState("");

    useEffect(() => {
        const fetchImages = async () => {
            const result = await ActionUserFetchImages(user.uid);
            updateImages(result);
        };

        if (user) fetchImages();
    }, []);

    return (
        <Card additionalClasses={[
            "flex-col",
            "w-full"
        ]}>
            <h3 className="text-md font-semibold">{currentUserOwnsProfile ? "Your" : `${user.userName}'s`} Gallery</h3>
            <div className="flex flex-row flex-wrap">
                {
                    images.length === 0 ?
                    <p className="text-sm font-semibold">{currentUserOwnsProfile ? "You have" : `${user.userName} has`} no public gallery images.</p> :
                    images.map((image, index) => (
                        <Image
                            key={index}
                            src={process.env.NEXT_PUBLIC_API_BASE_URL! + image.path}
                            alt={`An image posted by ${user.userName} as part of their gallery.`}
                            width={2048}
                            height={2048}
                            className="
                                flex
                                w-1/3
                                aspect-square
                                cursor-pointer
                                hover:opacity-75
                            "
                            onClick={() => {
                                setShowLightbox(true);
                                setActiveLightboxSrc(process.env.NEXT_PUBLIC_API_BASE_URL! + image.path);
                                setActiveLightboxImageID(image.mediaID);
                            }}
                        />
                    ))
                }
            </div>
            {
                showLightbox && (
                    <ImageLightbox
                        closeLightbox={() => setShowLightbox(false)}
                        src={activeLightboxSrc}
                        alt={`An image posted by ${user.userName} as part of their gallery.`}
                        height={5000}
                        width={5000}
                        imageID={activeLightboxImageID}
                        currentUserOwnsProfile={currentUserOwnsProfile}
                        currentUser={currentUser}
                        user={user}
                    />
                )
            }
        </Card>
    );
}