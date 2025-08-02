"use client";

import { useUser } from "@/_Contexts/User.context";
import isUser, { User } from "@/_Interfaces/User";
import Cookies from "js-cookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface SigninResult {
    serverResponse: string,
    serverResponseClass: "success-text" | "warn-text" | "error-text"
}

export async function RequestSignin(router: AppRouterInstance, user: string, password: string, setUser: (value: User) => void, setCurrentUser: (user: User | undefined) => void, setUidFromURL: (value: string) => void): Promise<SigninResult> {
    return new Promise(async (resolve) => {
        try {
            let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            let response = await fetch(API_BASE_URL + "/post/accounts/signin/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user, password }),
            });

            let result = await response.json();

            if (response.ok) {
                let user: User = {
                    ...result.payload,
                    _id: null,
                    tokens: {
                        accessToken: "",
                        refreshToken: result.payload.tokens.refreshToken,
                    },
                };

                if (isUser(user)) {
                    // Set the user cookie without userData
                    Cookies.set("user", JSON.stringify(user), {
                        expires: (1 / 24), // 1 hour
                        path: "/"
                    });

                    resolve({
                        serverResponse: "Successfully signed in! Please wait...",
                        serverResponseClass: "success-text"
                    });

                    setUser(user);
                    setCurrentUser(user);
                    setUidFromURL(user.uid);

                    setTimeout(() => {
                        router.push(`/profile?uid=${user.uid}`);
                    }, 3000);
                } else {
                    resolve({
                        serverResponse: "The fetched user object is malformed. Please try to sign in again, or contact an administrator.",
                        serverResponseClass: "error-text"
                    });
                }
            } else {
                console.error("Server Error:", result.message);

                resolve({
                    serverResponse: "Server error:" + result.message,
                    serverResponseClass: "error-text"
                });
            }
        } catch (error) {
            console.error("Network or parsing error:", error);
            
            resolve({
                serverResponse: "There has been a network or parsing error. Please try again, or contact an administrator.",
                serverResponseClass: "warn-text"
            });
        }
    });
}