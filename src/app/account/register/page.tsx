"use client";

import AccountForm from "@/components/Forms/FormAccount";
import FormSection from "@/components/Forms/FormSection";
import PasswordInput from "@/components/Forms/Inputs/InputPassword";
import TextInput from "@/components/Forms/Inputs/InputText";
import { Buttons } from "@/components/Buttons";
import { useState } from "react";
import { HelperUseCharacterCount } from "@/components/Forms/Helpers/HelperUseCharacterCount";
import { HTTPMethods } from "@/_Enums/HTTPMethods";
import isUser, { User } from "@/_Interfaces/User";
import Cookies from "js-cookie";
import { useUser } from "@/_Contexts/User.context";
import { useRouter } from "next/navigation";


export default function Registration() {
    const [formKey, setFormKey] = useState(0);
    const [serverResponse, setserverResponse] = useState("");
    const [serverResponseClass, setserverResponseClass] = useState("");
    const router = useRouter();
    const { setUser, setCurrentUser, setUidFromURL} = useUser();

    const username = HelperUseCharacterCount("username", 32);
    const firstName = HelperUseCharacterCount("first-name", 128);
    const lastName = HelperUseCharacterCount("last-name", 128);
    const email = HelperUseCharacterCount("email", 128);
    const discord = HelperUseCharacterCount("discord-username", 32);
    const password = HelperUseCharacterCount("password", 128);
    const repeatPassword = HelperUseCharacterCount("repeat-password", 128);

    // Form handler
    const resetForm = () => setFormKey(prev => prev + 1);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData.entries());

        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            const response = await fetch(API_BASE_URL + "/post/accounts/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                const user: User = {
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

                    setserverResponse("Registration successful! Please wait...");
                    setserverResponseClass("success-text");

                    setUser(user);
                    setCurrentUser(user);
                    setUidFromURL(user.uid);

                    setTimeout(() => {
                        router.push(`/profile?uid=${user.uid}`);
                    }, 3000);
                } else {
                    setserverResponse("The fetched user object is malformed. Please try to sign in again, or contact an administrator.");
                    setserverResponseClass("error-text");
                }
            } else {
                console.error("Server Error:", result.message);

                setserverResponse(result.message);
                setserverResponseClass("error-text");
            }
        } catch (error) {
            console.error("Network or parsing error:", error);
            setserverResponse("There has been a network or parsing error. Please try again, or contact an administrator.");
            setserverResponseClass("warn-text");
        }
    }

    return (
        <AccountForm key={formKey} id="registration-form" formMethod={HTTPMethods.Post} onSubmit={handleSubmit}>

            <FormSection optionalStyling={null}>
                <h1 className="text-xl font-bold text-center">Register for an account</h1>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <p className="text-xs font-bold text-center">This will register you for a linked account across all of Wild Whispers' services, ran by QuietWind01 (AKA QuietWindUponTheMoor).</p>
                <p className={`text-xs font-bold text-center ${serverResponseClass}`}>{serverResponse}</p>
            </FormSection>

            <FormSection optionalStyling={null}>
                <label htmlFor="username" className="font-semibold text-xs">Username</label>
                <TextInput id="username" name="userName" minLength={1} maxLength={32} placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => username.handleChange(e.target)} required></TextInput>
                <p className="">{username.count} / 32</p>
            </FormSection>

            <FormSection optionalStyling={"flex-row justify-between"}>
                <div className="flex flex-col flex-1">
                    <label htmlFor="first-name" className="font-semibold text-xs">First (Optional)</label>
                    <TextInput id="first-name" name="firstName" minLength={1} maxLength={128} placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => firstName.handleChange(e.target)}></TextInput>
                    <p className="">{firstName.count} / 128</p>
                </div>
                <div className="flex flex-col flex-1">
                    <label htmlFor="last-name" className="font-semibold text-xs">Last (Optional)</label>
                    <TextInput id="lastName" name="lastName" minLength={1} maxLength={128} placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => lastName.handleChange(e.target)}></TextInput>
                    <p className="">{lastName.count} / 128</p>
                </div>
            </FormSection>

            <FormSection optionalStyling={null}>
                <label htmlFor="email" className="font-semibold text-xs">Email</label>
                <TextInput id="email" name="email" minLength={1} maxLength={128} placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => email.handleChange(e.target)} required></TextInput>
                <p className="">{email.count} / 128</p>
            </FormSection>

            <FormSection optionalStyling={null}>
                <label htmlFor="discord-username" className="font-semibold text-xs">Discord Handle (Optional)</label>
                <TextInput id="discord-username" name="discordUsername" minLength={1} maxLength={32} placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => discord.handleChange(e.target)}></TextInput>
                <p className="">{discord.count} / 32</p>
            </FormSection>

            <FormSection optionalStyling={null}>
                <label htmlFor="password" className="font-semibold text-xs">Desired Password</label>
                <PasswordInput id="password" name="password" minLength={8} maxLength={128} placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => password.handleChange(e.target)} required></PasswordInput>
                <p className="">{password.count} / 128</p>
            </FormSection>

            <FormSection optionalStyling={null}>
                <label htmlFor="repeat-password" className="font-semibold text-xs">Repeat Password</label>
                <PasswordInput id="repeat-password" name="repeatPassword" minLength={8} maxLength={128} placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => repeatPassword.handleChange(e.target)} required></PasswordInput>
                <p className="">{repeatPassword.count} / 128</p>
            </FormSection>

            <FormSection optionalStyling="flex-row justify-between">
                <Buttons.Main id="submit-form-button" type="submit">Register</Buttons.Main>
                <Buttons.Action id="reset-form-button" onClick={resetForm}>Reset Form</Buttons.Action>
            </FormSection>

        </AccountForm>
    );
}