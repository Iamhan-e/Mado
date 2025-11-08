"use client"

import { useSession } from "next-auth/react"

export function useCurrentUser() {
  const { data: session, status } = useSession()

  return {
    user: session?.user
      ? {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.name || null,
          username: session.user.username || null,
          avatar: session.user.avatar || null,
        }
      : null,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
  }
}