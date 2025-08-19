"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      ...form,
      redirect: false,
    });

    console.log(res);

    if (res?.ok) router.push("/dashboard");  
    else alert("Login failed");
  };

  return (
    <div>
      <input
        name="email"
        autoComplete="off"
        placeholder="Email or Username"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        name="password"
        autoComplete="off"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
