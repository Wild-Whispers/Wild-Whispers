"use client";

import Card from "@/components/Card";
import InfoCardSection from "../ProfileInfoCardSection";
import { useUser } from "@/_Contexts/User.context";

export default function CardProfileInfo() {
    const { currentUser, user, currentUserOwnsProfile, setCurrentUser, setUser, uidFromURL } = useUser();
    if (!user) return;
    
    if (!user.userData.info) {
        return (
            <Card additionalClasses={[
            "flex-col",
            "w-1/2",
            "gap-2",
        ]}>
            <h3 className="text-md font-semibold">{currentUserOwnsProfile ? "Your" : `${user.userName}'s`} General Info</h3>
            <p className="text-sm font-semibold">{currentUserOwnsProfile ? "You have" : user.userName + "has"} not provided any information here.</p>
        </Card>
        );
    }

    return (
        <Card additionalClasses={[
            "flex-col",
            "w-full",
            "gap-2",
        ]}>
            <h3 className="text-md font-semibold">{currentUserOwnsProfile ? "Your" : `${user.userName}'s`} General Info</h3>
            {user.userData.info.map((question, index) => (
                <InfoCardSection key={index} currentUserOwnsProfile={currentUserOwnsProfile} currentUser={currentUser} type={question.type} label={question.label} text={question.answer}/>
            ))}
        </Card>
    );
}