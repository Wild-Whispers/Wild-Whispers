"use client";

import { User } from "@/_Interfaces/User";
import Cookies from "js-cookie";

export function RequestRotateRefreshToken(user: User) {
    (async () => {
        console.log("Rotating refresh tokens...");

        try {
            let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

            let response = await fetch(API_BASE_URL + "/patch/tokens/refresh/rotate/", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uid: user.uid, token: user.tokens.refreshToken }),
            });

            let result = await response.json();

            if (response.ok) {
                // Update user cookie with new expiry and rotated refresh token
                user.tokens.refreshToken = result.payload;

                Cookies.set("user", JSON.stringify(user), {
                    expires: (1 / 24), // 1 hour
                    path: "/"
                });
            } else {
                console.warn("Token rotate error:", result.message);
            }
        } catch (error) {
            console.error("Token rotate error:", error);
        }
    })();
}