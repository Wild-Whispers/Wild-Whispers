import { MinusCircleIcon } from "@heroicons/react/24/solid";


export default function PostDropdownTriggerMinus({ ...props }) {
    return (
        <MinusCircleIcon
            title="Add Attachments"
            {...props}
            className="
                w-8
                h-8
                cursor-pointer
                select-none
                fill-fuchsia-50/90
                hover:fill-fuchsia-50
            "
        />
    );
}