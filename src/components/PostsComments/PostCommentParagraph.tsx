"use client";

import { Fragment } from "react";

export default function PostCommentParagraph({ text }: { text: string }) {
    return <p className="text-sm leading-3">
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