import { useEffect, useRef, useState } from "react";
import InputCharacterCountFormatter from "./HelperInputCharacterCountFormatter";


export function HelperUseCharacterCount(id: string, maxLength: number) {
    const [count, setCount] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (input: HTMLInputElement) => {
        setCount(input.value.length);
        InputCharacterCountFormatter(input, maxLength);
    }

    // Fix autofill :/
    useEffect(() => {
        const input = document.getElementById(id) as HTMLInputElement | null;

        if (input) {
            inputRef.current = input;

            if (input.value) {
                setCount(input.value.length);
                InputCharacterCountFormatter(input, maxLength);
            }
        }
    }, []);

    return { count, handleChange };
}