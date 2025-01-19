"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SingIn(): React.ReactNode {

    const { data: session } = useSession();

    if (session) {
        return (
          <div>
            <p>Welcome, {session.user?.name}</p>
            <button onClick={() => signOut()}>Sign Out</button>
          </div>
        );
      }

  return (
    
    <div className="login text-end text-blue-500">
    <button onClick={() => signIn("google")}>Sign In with Google</button>
    </div>
  );
}


