"use client";

import { Fragment } from "react";

export default function PostCardParagraph({ text }: { text: string }) {
    return <p className="text-md leading-4">
        {
            text.split("\n").map((line, i) => (
                <Fragment key={i}>
                    {line}
                    <br />
                </Fragment>
            ))
        }
    </p>;
}