"use client";

import isUser, { User } from "@/_Interfaces/User";
import Cookies from "js-cookie";

/**
 * Fetches new tokens using the current refresh token, if the user is logged in
 */
/* eslint-disable @next/next/no-async-client-component */
export default async function RequestNewAccessToken(user: User): Promise<User | null> {
    if (!isUser(user)) return null;

    try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

        const response = await fetch(API_BASE_URL + "/post/tokens/access/get-using-refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: user.uid, token: user.tokens!.refreshToken }),
        });

        const result = await response.json();

        if (response.ok) {
            // Update user cookie with new expiry and new refresh token
            const newUser: User = {
                ...user,
                tokens: {
                    accessToken: result.payload.accessToken,
                    refreshToken: result.payload.refreshToken
                }
            };

            Cookies.set("user", JSON.stringify(newUser), {
                expires: (1 / 24), // 1 hour
                path: "/"
            });

            return newUser;
        } else {
            console.warn("Access token fetch error:", result.message);
            return null;
        }
    } catch (error) {
        console.error("Access token fetch error:", error);
        return null;
    }
}