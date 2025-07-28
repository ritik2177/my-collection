"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null; 

  return (
    <div>
      <h1>Welcome to Dashboard, {session.user?.name}!</h1>
      <button onClick={() => signOut({ callbackUrl: "/sign-in" })}>
        Logout
      </button>
    </div>
  );
}
