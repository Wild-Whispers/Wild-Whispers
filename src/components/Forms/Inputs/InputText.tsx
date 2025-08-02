"use client";

export default function InputText({ ...props }) {
    return <input
        type="text"
        className="
            p-1
            border-b-1
            outline-none
            focus:bg-lime-50/20
            text-sm
        "
        {...props}
    />
}