"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Mail, FileText, Image as ImageIcon } from "lucide-react"

interface EditProfileFormProps {
  user: {
    id: string
    name: string | null
    username: string | null
    bio: string | null
    avatar: string | null
    email: string
  }
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update profile")
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/profile/${user.username}`)
        router.refresh()
      }, 1000)
    } catch (error) {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Profile updated successfully! Redirecting...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Email (Read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="email"
            value={user.email}
            className="pl-11 bg-gray-50"
            disabled
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
      </div>

      {/* Username (Read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            value={user.username || ""}
            className="pl-11 bg-gray-50"
            disabled
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
      </div>

      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Display Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            name="name"
            placeholder="Your display name"
            value={formData.name}
            onChange={handleChange}
            className="pl-11"
            maxLength={50}
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <textarea
            name="bio"
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={handleChange}
            className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 resize-none"
            rows={4}
            maxLength={200}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {formData.bio.length}/200 characters
        </p>
      </div>

      {/* Avatar URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar URL
        </label>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="url"
            name="avatar"
            placeholder="https://example.com/avatar.jpg"
            value={formData.avatar}
            onChange={handleChange}
            className="pl-11"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Paste a direct link to your avatar image
        </p>
        {formData.avatar && (
          <div className="mt-3">
            <img
              src={formData.avatar}
              alt="Avatar preview"
              className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                e.currentTarget.src = ""
                setError("Invalid image URL")
              }}
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="flex-1"
        >
          Save Changes
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(`/profile/${user.username}`)}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}