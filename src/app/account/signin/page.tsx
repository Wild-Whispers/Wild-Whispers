"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AccountForm from "@/components/Forms/FormAccount";
import FormSection from "@/components/Forms/FormSection";
import TextInput from "@/components/Forms/Inputs/InputText";
import PasswordInput from "@/components/Forms/Inputs/InputPassword";
import { Buttons } from "@/components/Buttons";
import { HelperUseCharacterCount } from "@/components/Forms/Helpers/HelperUseCharacterCount";
import { RequestSignin } from "@/_Requests/RequestSignin";
import { HTTPMethods } from "@/_Enums/HTTPMethods";
import { useUser } from "@/_Contexts/User.context";

interface SigninResultPayload {
    user: string,
    password: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // SHUT UP compiler
}

export default function Signin() {
    const [formKey, setFormKey] = useState(0);
    const [serverResponse, setserverResponse] = useState("");
    const [serverResponseClass, setserverResponseClass] = useState("");
    const router = useRouter();
    const { setUser, setCurrentUser, setUidFromURL } = useUser();

    const user = HelperUseCharacterCount("user", 32);
    const password = HelperUseCharacterCount("password", 128);

    // Form handler
    const resetForm = () => setFormKey(prev => prev + 1);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData.entries()) as SigninResultPayload;

        const { serverResponse, serverResponseClass } = await RequestSignin(router, payload.user, payload.password, setUser, setCurrentUser, setUidFromURL);

        setserverResponse(serverResponse);
        setserverResponseClass(serverResponseClass);
    }

    return (
        <AccountForm key={formKey} id="registration-form" formMethod={HTTPMethods.Post} onSubmit={handleSubmit}>

            <FormSection optionalStyling={null}>
                <h1 className="text-xl font-bold text-center">Sign in to your Wild Whispers account</h1>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <p className="text-xs font-bold text-center">This will sign you in to your linked account across all of Wild Whispers' services, ran by QuietWind01 (AKA QuietWindUponTheMoor).</p>
                <p className={`text-xs font-bold text-center ${serverResponseClass}`}>{serverResponse}</p>
            </FormSection>

            <FormSection optionalStyling={null}>
                <label htmlFor="user" className="font-semibold text-xs">Username or Email Address</label>
                <TextInput id="user" name="user" minLength={1} maxLength={32} placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => user.handleChange(e.target)} required></TextInput>
                <p className="">{user.count} / 32</p>
            </FormSection>

            <FormSection optionalStyling={null}>
                <label htmlFor="password" className="font-semibold text-xs">Password</label>
                <PasswordInput id="password" name="password" minLength={8} maxLength={128} placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => password.handleChange(e.target)} required></PasswordInput>
                <p className="">{password.count} / 128</p>
            </FormSection>

            <FormSection optionalStyling="flex-row justify-between">
                <Buttons.Main id="submit-form-button" type="submit">Sign In</Buttons.Main>
                <Buttons.Action id="reset-form-button" onClick={resetForm}>Reset Form</Buttons.Action>
            </FormSection>

        </AccountForm>
    );
}