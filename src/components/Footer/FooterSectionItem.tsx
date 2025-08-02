import Image from "next/image";
import Link from "next/link";


export default function FooterSectionItem({ text, linkHref, iconSrc }: { text: string, linkHref?: string, iconSrc?: string }) {
    return (
        <div className="flex flex-row justify-between items-center gap-2">
            {iconSrc && <Image className="w-4 h-4" width={128} height={128} src={iconSrc} alt="Footer section icon"/>}
            {
                linkHref ?
                <Link className="text-xs hover:underline" href={linkHref}>{text}</Link> :
                <p className="text-xs">{text}</p>
            }
        </div>
    );
}