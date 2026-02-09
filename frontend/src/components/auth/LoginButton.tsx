"use client";

import { useState, useEffect } from "react";
import { LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAuthenticated, logout, getMe, loginWithGoogle } from "@/lib/api/auth";
import { getSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const [authed, setAuthed] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncAuth = async () => {
      // If already has backend token, verify it
      if (isAuthenticated()) {
        try {
          const user = await getMe();
          setAuthed(true);
          setUserName(user.name);
          return;
        } catch {
          // Token invalid, clear it
          logout();
        }
      }

      // Check if NextAuth has a session with id_token we haven't exchanged yet
      try {
        const session = await getSession();
        const idToken = (session as unknown as Record<string, unknown>)?.id_token;
        if (idToken && typeof idToken === "string") {
          const data = await loginWithGoogle({ id_token: idToken });
          setAuthed(true);
          setUserName(data.user.name);
        }
      } catch {
        // No NextAuth session or exchange failed
      }
    };
    syncAuth();
  }, []);

  if (authed) {
    return (
      <div className="flex items-center gap-2">
        {userName && (
          <span className="hidden text-xs text-zinc-400 md:inline">
            <User className="mr-1 inline size-3" />
            {userName}
          </span>
        )}
        <Button
          variant="ghost"
          size="xs"
          onClick={async () => {
            logout();
            await signOut({ redirect: false });
            setAuthed(false);
            window.location.reload();
          }}
          className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 hover:text-amber-500"
        >
          <LogOut className="size-3" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        signIn("google");
      }}
      className="border-zinc-700 bg-zinc-900 font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:border-amber-600/50 hover:bg-amber-600/10 hover:text-amber-500"
    >
      <LogIn className="size-3" />
      {loading ? "Signing in..." : "Sign In"}
    </Button>
  );
}
