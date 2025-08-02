"use client";

import { ActionUserFetchByID } from "@/_Actions/ActionUserFetchByID";
import isUser, { User } from "@/_Interfaces/User";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type UserContextType = {
    currentUser: User | undefined,
    user: User | undefined,
    currentUserOwnsProfile: boolean,
    setCurrentUser: (value: User | undefined) => void,
    setUser: (value: User) => void,
    uidFromURL: string | null,
    setUidFromURL: (value: string) => void,
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [uidFromURL, setUidFromURL] = useState<string | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const init = async () => {
            // Set uid from url params
            const uid = searchParams.get("uid");
            setUidFromURL(uid);

            // Set currentUser from cookie
            const cookie: string | undefined = Cookies.get("user");
            if (cookie) {
                let parsedCurrentUser;

                try {
                    parsedCurrentUser = JSON.parse(cookie);
                } catch (error) {
                    console.warn("The user cookie was set, but the JSON was malformed.");
                }

                if (isUser(parsedCurrentUser)) setCurrentUser(parsedCurrentUser);
            }

            // Set user from uid params
            if (uid) {
                const _user = await ActionUserFetchByID(uid);
                if (isUser(_user)) setUser(_user);
            }

            setReady(true);
        };

        init();
    }, [searchParams]);

    const currentUserOwnsProfile = useMemo(() => {
        return currentUser?.uid === user?.uid; // False if uids don't match OR if either user object isn't' set/is malformed
    }, [currentUser, user]);

    const contextValue = useMemo(() => ({
        currentUser,
        user,
        currentUserOwnsProfile,
        setCurrentUser,
        setUser,
        uidFromURL,
        setUidFromURL
    }), [currentUser, user, currentUserOwnsProfile, uidFromURL]);

    if (!ready) return null;

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used inside <UseContextProvider>");
    }

    return context;
}