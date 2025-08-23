"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";


export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const sendEmail = async () => {
    setLoading(true);
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: session?.user.email,
        subject: `Hello  ${session?.user.name}`,
        text: `This is a test email from Ritik!  ${session?.user.email}`,
      }),
    });

    const data = await res.json();
    setLoading(false);
    toast.success(data.success ? "Email sent!" : `Failed: ${data.error}`);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={sendEmail}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {loading ? "Sending..." : "Send Email"}
      </button>
    </div>
  );
}
