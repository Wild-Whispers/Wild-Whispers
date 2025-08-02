import Image from "next/image";
import FooterSection from "./FooterSection";
import FooterSectionLabel from "./FooterSectionLabel";
import FooterSectionItem from "./FooterSectionItem";

export default function Footer() {
    return (
        <div className="
            flex
            flex-col
            p-2
            px-20
            gap-2
            
            bg-slate-800
            z-100
        ">

            <p className="text-2xl font-semibold text-center">Wild Whispers alpha</p>

            <div className="flex flex-row w-full justify-center items-start flex-wrap min-h-50 p-2 gap-20">


                <FooterSection>
                    <Image className="w-40 h-40" width={2560} height={2560} src="/assets/icon_v1.png" alt="Wild Whisper Network's Mascot"/>
                    <p className="text-xs">The Wild Whispers Network's official mascot</p>
                </FooterSection>

                <FooterSection>
                    <FooterSectionLabel text="Meet The Team"/>
                    <FooterSectionItem text="Quiet Wind" linkHref="/team/quietwind/"/>
                    <FooterSectionItem text="Skye" linkHref="/team/skye/"/>
                    <FooterSectionItem text="Soleil" linkHref="/team/soleil/"/>
                </FooterSection>

                <FooterSection>
                    <FooterSectionLabel text="Find Us"/>
                    <FooterSectionItem text="Discord" linkHref="https://discord.gg/953y78UZEp" iconSrc="/assets/icons/discord.png"/>
                </FooterSection>

                <FooterSection>
                    <FooterSectionLabel text="Technologies"/>
                    <FooterSectionItem text="Next.js v15.4.1 [React 19]"/>
                    <FooterSectionItem text="TypeScript v5"/>
                    <FooterSectionItem text="Tailwind v4"/>
                    <FooterSectionItem text="MongoDB"/>
                    <FooterSectionItem text="Redis"/>
                    <FooterSectionItem text="Node.js"/>
                </FooterSection>


            </div>
            
            <p className="text-sm font-semibold text-center">© 2024-2025 Wild Whispers. All rights reserved.</p>

        </div>
    );
}