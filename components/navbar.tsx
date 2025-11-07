"use client"

import Link from "next/link"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Button } from "./ui/button"
import { signOut } from "next-auth/react"
import { User, LogOut, BookOpen, PenSquare } from "lucide-react"

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useCurrentUser()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-[#FF6B6B]" />
            <span className="text-2xl font-bold text-[#FF6B6B]">Mado</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/browse"
              className="text-gray-700 hover:text-[#FF6B6B] transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/genres"
              className="text-gray-700 hover:text-[#FF6B6B] transition-colors"
            >
              Genres
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : isAuthenticated && user ? (
              <>
                <Link href="/write">
                  <Button variant="secondary" className="hidden sm:flex">
                    <PenSquare className="h-4 w-4 mr-2" />
                    Write
                  </Button>
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || "User"}
                        className="h-10 w-10 rounded-full border-2 border-[#FF6B6B]"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#FF6B6B] flex items-center justify-center text-white font-semibold">
                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>

                      <Link
                        href={`/profile/${user.username}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>

                      <Link
                        href="/write"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors md:hidden"
                      >
                        <PenSquare className="h-4 w-4 mr-2" />
                        Write
                      </Link>

                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}