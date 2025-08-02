"use client";

import { forwardRef, TextareaHTMLAttributes, useEffect, useImperativeHandle, useRef, useState } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string,
    valueUpdater: (newValue: string) => void
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ value, valueUpdater, ...props }, ref) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);

    // Support both internal ref and forwarded ref
    useImperativeHandle(ref, () => innerRef.current!);

    useEffect(() => {
        const target = innerRef.current;

        if (!target) return;

        target.style.height = "auto";
        target.style.height = `${target.scrollHeight}px`;
    }, [value]);

    return <textarea
        ref={innerRef}
        className="
            flex
            flex-grow
            p-2

            leading-tight
            overflow-hidden    
            
            outline-none
            bg-fuchsia-950/20
            text-sm
            resize-none
            rounded-2xl
        "
        {...props}
        placeholder="Whisper something to your followers..."
        rows={1}
        value={value}
        onChange={(e) => {
            valueUpdater(e.currentTarget.value);
            const target = e.currentTarget;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
        }}
    ></textarea>
});

TextArea.displayName = "TextArea";

export default TextArea;