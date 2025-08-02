"use client";

export default function InputPassword({ ...props }) {
    return <input
        type="password"
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