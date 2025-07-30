'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function RegisterPage({ handleClose }: { handleClose: () => void }) {
    const [form, setForm] = useState({ username: '', email: '', password: '', mobilenumber: '' })
    const router = useRouter()

    const handleRegister = async () => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            handleClose();
            router.push('/sign-in');
        } else {
            const data = await res.json();
            alert(data.message);
        }
    };

    return (
        <div className="h-auto flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
                <h2 className="text-2xl font-semibold text-center">Register</h2>

                <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Username"
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                />

                <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Email"
                    type="email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Mobile Number"
                    type="tel"
                    onChange={(e) => setForm({ ...form, mobilenumber: e.target.value })}
                />

                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    onClick={handleRegister}
                     
                >
                    Register
                </button>
            </div>
        </div>
    )
}