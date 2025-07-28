'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function RegisterPage(){
    const [ from, setForm ] = useState({username: '', email: '', password: '', mobilenumber: ''})
    const router = useRouter()

    const handleRegister = async () => {
        const res = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(from),
    })
    }
}