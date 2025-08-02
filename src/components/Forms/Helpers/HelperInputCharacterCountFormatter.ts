

export default function HelperInputCharacterCountFormatter(input: HTMLInputElement, max: number) {
    let length = input.value.length;

    let percentage = Math.floor((length / max) * 100);

    if (percentage < 50) {
        input.classList.remove("char-limit-50");
        input.classList.remove("char-limit-75");
        input.classList.remove("char-limit-90");
        input.classList.remove("char-limit-100");
    }

    if (percentage >= 50 && percentage < 76) {
        input.classList.add("char-limit-75");
        input.classList.remove("char-limit-50");
        input.classList.remove("char-limit-90");
        input.classList.remove("char-limit-100");
    }

    if (percentage >= 75 && percentage < 91) {
        input.classList.add("char-limit-90");
        input.classList.remove("char-limit-50");
        input.classList.remove("char-limit-75");
        input.classList.remove("char-limit-100");
    }

    if (percentage >= 90 && percentage >= 99) {
        input.classList.add("char-limit-100");
        input.classList.remove("char-limit-50");
        input.classList.remove("char-limit-75");
        input.classList.remove("char-limit-90");
    }
}