import { VideoCameraIcon } from "@heroicons/react/24/solid";


export default function PostDropdownAttachmentVideo({ clickHandler }: { clickHandler: () => void }) {
    return (
        <div className="flex flex-row justify-start items-center w-full p-2 cursor-pointer gap-2 hover:bg-fuchsia-950/10" onClick={clickHandler}>
            <VideoCameraIcon
                title="Add Video"
                className="
                    w-8
                    h-8
                    cursor-pointer
                    fill-fuchsia-50/90
                    hover:fill-fuchsia-50
                "
            />
            <p className="text-sm font-semibold">Add Video</p>
        </div>
    );
}