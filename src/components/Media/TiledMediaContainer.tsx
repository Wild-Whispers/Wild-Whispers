"use client";

import { useUser } from "@/_Contexts/User.context";
import { User } from "@/_Interfaces/User";
import TiledMediaContainerLightbox from "@/components/Lightboxes/TiledMediaContainerLightbox";
import Image from "next/image";
import { useEffect, useState } from "react";

export enum MediaTypes {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO"
}

export interface TiledMedia {
    type: MediaTypes,
    src: string,
    alt: string,
}

export default function TiledMediaContainer({ media }: { media: Array<TiledMedia> }) {
    const { currentUser, user, currentUserOwnsProfile, setCurrentUser, setUser, uidFromURL } = useUser();

    const [showLightbox, setShowLightbox] = useState(false);
    const [clickedMediaIndex, setClickedMediaIndex] = useState<number>(0);
    
    const displayMedia = () => {
        return media.map((item, i) => {
            if (item.type === MediaTypes.IMAGE) {
                return (
                    <div
                        key={i}
                        data-not-shown-count={`+${media.length - 3}`}
                        onClick={() => {
                            setShowLightbox(true);
                            setClickedMediaIndex(i);
                        }}
                        className={`
                            flex
                            pc-media-item
                            ${i === 0 ? "large" : ""}
                            ${i > 2 ? "hidden" : ""}
                            ${i === 2 && media.length > 3 ? "see-more-overlay" : ""}
                            justify-center
                            items-center
                        `}>
                        <Image
                            src={item.src}
                            alt={item.alt}
                            width={5000}
                            height={5000}
                            className=""
                        />
                    </div>
                )
            }

            return null;
        });
    };

    return (
        <div className="pc-media-container bg-slate-950">
            {displayMedia()}
            {
                showLightbox && (
                    <TiledMediaContainerLightbox
                        closeLightbox={() => setShowLightbox(false)}
                        media={media}
                        indexToDisplay={clickedMediaIndex}
                    />
                )
            }
        </div>
    );
}