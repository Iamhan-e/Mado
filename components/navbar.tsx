"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { signOut } from "next-auth/react"
import { BookOpen, PenTool, Search, User, LogOut, Menu, X, Settings } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { user, isAuthenticated } = useCurrentUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-surface border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <BookOpen className="h-8 w-8" />
            <span>Mado</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/browse"
              className="flex items-center gap-2 text-textPrimary hover:text-primary transition-colors"
            >
              <Search className="h-5 w-5" />
              <span>Browse</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/write"
                  className="flex items-center gap-2 text-textPrimary hover:text-primary transition-colors"
                >
                  <PenTool className="h-5 w-5" />
                  <span>Write</span>
                </Link>

                <Link
                  href={`/profile/${user?.username}`}
                  className="flex items-center gap-2 text-textPrimary hover:text-primary transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "User"}
                      className="h-8 w-8 rounded-full border-2 border-primary object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span>{user?.name || user?.username || "Profile"}</span>
                </Link>

                <Link
                  href="/settings/profile"
                  className="flex items-center gap-2 text-textSecondary hover:text-primary transition-colors"
                  title="Settings"
                >
                  <Settings className="h-5 w-5" />
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 text-textPrimary hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-textPrimary"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-parchment">
            <div className="flex flex-col gap-4">
              <Link
                href="/browse"
                className="flex items-center gap-2 text-textPrimary hover:text-primary transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-5 w-5" />
                <span>Browse</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/write"
                    className="flex items-center gap-2 text-textPrimary hover:text-primary transition-colors px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <PenTool className="h-5 w-5" />
                    <span>Write</span>
                  </Link>

                  <Link
                    href={`/profile/${user?.username}`}
                    className="flex items-center gap-2 text-textPrimary hover:text-primary transition-colors px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    href="/settings/profile"
                    className="flex items-center gap-2 text-textPrimary hover:text-primary transition-colors px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut({ callbackUrl: "/" })
                    }}
                    className="flex items-center gap-2 text-textPrimary hover:text-red-600 transition-colors px-4 py-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
