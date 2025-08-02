"use client";

import { useUser } from "@/_Contexts/User.context";
import { Buttons } from "@/components/Buttons";
import { TiledMedia } from "@/components/Media/TiledMediaContainer";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface TiledMediaImageLightboxProps {
    closeLightbox: () => void,
    media: Array<TiledMedia>,
    indexToDisplay: number
}

export default function TiledMediaContainerLightbox({ closeLightbox, media, indexToDisplay }: TiledMediaImageLightboxProps) {
    const { currentUserOwnsProfile } = useUser();
    
    const [currentMedia, setCurrentMedia] = useState<TiledMedia>(media[indexToDisplay]);
    const [currentIndex, setCurrentIndex] = useState<number>(indexToDisplay);
    const prevRef = useRef<HTMLDivElement>(null);
    const nextRef = useRef<HTMLDivElement>(null);

    const disableLeftChevron = () => {
        if (prevRef.current && nextRef.current) {
            prevRef.current.style.opacity = "0.20";
            nextRef.current.style.opacity = "1";
        }
    };

    const disableRightChevron = () => {
        if (prevRef.current && nextRef.current) {
            prevRef.current.style.opacity = "1";
            nextRef.current.style.opacity = "0.2";
        }
    };

    const enableBothChevrons = () => {
        if (prevRef.current && nextRef.current) {
            prevRef.current.style.opacity = "1";
            nextRef.current.style.opacity = "1";
        }
    };

    const prevImage = () => {
        const newIndex = currentIndex - 1;

        const isNonExistent = newIndex < 0;
        const isFirstPage = newIndex === 0;

        if (isNonExistent) {
            return;
        } else if (isFirstPage) {
            disableLeftChevron();
        } else {
            enableBothChevrons();
        }
        
        setCurrentIndex(newIndex);
        setCurrentMedia(media[newIndex]);
    };

    const nextImage = () => {
        const newIndex = currentIndex + 1;

        const isNonExistent = newIndex >= media.length;
        const isLastPage = newIndex === media.length - 1;

        if (isNonExistent) {
            return;
        } else if (isLastPage) {
            disableRightChevron();
        } else {
            enableBothChevrons();
        }

        setCurrentIndex(newIndex);
        setCurrentMedia(media[newIndex]);
    };

    useEffect(() => {
        if (prevRef.current && nextRef.current) {
            if (currentIndex === 0) prevRef.current.style.opacity = "0.20";
            if (currentIndex === media.length - 1) nextRef.current.style.opacity = "0.20";
        }

        document.body.classList.add("lightbox-open");

        return () => {
            document.body.classList.remove("lightbox-open");
        }
    }, [currentIndex, media.length]);

    return (
        <div className="fixed flex flex-col justify-start items-center w-full h-full right-0 bottom-0 left-0 top-0 backdrop-blur-sm z-100 overflow-y-scroll">
            <div className="relative flex flex-col justify-start items-center w-full h-full">

                <div className="flex flex-row justify-between items-center top-0 w-full p-2 bg-indigo-950 gap-2">
                    {
                        currentUserOwnsProfile && (
                            <div className="flex flex-row gap-2">
                                <Buttons.Main>Set As Profile Image</Buttons.Main>
                                <Buttons.Main>Set As Profile Banner</Buttons.Main>
                            </div>
                        )
                    }
                    <XMarkIcon onClick={closeLightbox} className="flex flex-row justify-center items-center w-10 h-10 cursor-pointer hover:text-red-400" title="Close lightbox"/>
                </div>

                <span className="flex flex-row justify-center items-center max-w-full mt-10 gap-2">
                    <div ref={prevRef} className="flex flex-col justify-center items-center w-30 h-full">
                        <ChevronLeftIcon onClick={prevImage} className={`w-full aspect-square hover:opacity-75`}/>
                    </div>

                    <Image
                        src={currentMedia.src}
                        alt={currentMedia.alt}
                        width={5000}
                        height={5000}
                        className="
                            flex
                            max-w-3/4
                        "
                    />

                    <div ref={nextRef} className="flex flex-col justify-center items-center w-30 h-full">
                        <ChevronRightIcon onClick={nextImage} className="w-full aspect-square hover:opacity-75"/>
                    </div>
                </span>

            </div>
        </div>
    );
}