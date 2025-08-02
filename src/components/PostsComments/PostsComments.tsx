import { Post } from "@/_Interfaces/Post";
import { User } from "@/_Interfaces/User";
import { Mimes } from "@/_Enums/Mimes";
import { MediaTypes, TiledMedia } from "../Media/TiledMediaContainer";
import { UserMedia } from "@/_Interfaces/UserMedia";
import PostCardMetaSmall from "../PostCard/PostCardMetaSmall";
import PostCommentParagraph from "./PostCommentParagraph";


export default function PostsComments({ whisper, whisperCreator, mediaRaw }: {whisper: Post, whisperCreator: User, mediaRaw: Array<UserMedia> }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const media: Array<TiledMedia> = mediaRaw.map(image => {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

        return {
            type: (image.mimeType === Mimes.PNG || image.mimeType === Mimes.JPG || image.mimeType === Mimes.WEBP) ? MediaTypes.IMAGE : MediaTypes.VIDEO,
            src: API_BASE_URL + image.path,
            alt: image.altText
        }
    });

    return (
        <div className="
            flex
            flex-col
            gap-2
        ">
            <PostCardMetaSmall user={whisperCreator} timestamp={whisper.timestamp} userImage={whisper.userImage}/>

            <PostCommentParagraph text={whisper.paragraphs}/>
        </div>
    );
}