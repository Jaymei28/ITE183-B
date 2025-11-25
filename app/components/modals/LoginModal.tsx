'use client';

import Modal from "./Modal";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import useLoginModal from "@/app/hooks/useLoginModal";
import CustomButton from "../forms/CustomButton";
import { handleLogin } from "@/app/lib/actions";
import apiService from "@/app/services/apiService";

const LoginModal = () => {
    const router = useRouter()
    const loginModal = useLoginModal()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const submitLogin = async () => {
        setErrorMessage('');
        const formData = {
            email: email,
            password: password
        }

        const response = await apiService.post('/api/auth/login/', formData)

        if (response.access) {
            handleLogin(response.user.pk, response.access, response.refresh);

            loginModal.close();

            router.push('/')
        } else {
            const fromNonField = Array.isArray(response?.non_field_errors) ? response.non_field_errors[0] : undefined;
            const fromDetail = typeof response?.detail === 'string' ? response.detail : undefined;
            const fallback = Object.values(response || {}).flatMap((v: any) => Array.isArray(v) ? v : [String(v)]).join('\n');
            setErrorMessage(fromNonField || fromDetail || fallback || 'Unable to log in with provided credentials.');
        }
    }

    const content = (
        <>
            <form 
                onSubmit={(e) => { e.preventDefault(); submitLogin(); }}
                className="space-y-4"
            >
                <input onChange={(e) => setEmail(e.target.value)} placeholder="Your e-mail address" type="email" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />

                <input onChange={(e) => setPassword(e.target.value)} placeholder="Your password" type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />
            
                {errorMessage && (
                    <div className="p-5 bg-airbnb text-white rounded-xl opacity-80">
                        {errorMessage}
                    </div>
                )}

                <CustomButton
                    label="Submit"
                    onClick={submitLogin}
                />
            </form>
        </>
    )

    return (
        <Modal
            isOpen={loginModal.isOpen}
            close={loginModal.close}
            label="Log in"
            content={content}
        />
    )
}

export default LoginModal;
