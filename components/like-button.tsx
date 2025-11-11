"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface LikeButtonProps {
  storyId: string
  initialLikes: number
  initialIsLiked: boolean
  isAuthenticated: boolean
}

export default function LikeButton({
  storyId,
  initialLikes,
  initialIsLiked,
  isAuthenticated,
}: LikeButtonProps) {
  const router = useRouter()
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setIsLoading(true)

    // Optimistic update
    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setLikes((prev) => (newIsLiked ? prev + 1 : prev - 1))

    try {
      const response = await fetch(`/api/stories/${storyId}/like`, {
        method: "POST",
      })

      if (!response.ok) {
        // Revert on error
        setIsLiked(!newIsLiked)
        setLikes((prev) => (newIsLiked ? prev - 1 : prev + 1))
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked)
      setLikes((prev) => (newIsLiked ? prev - 1 : prev + 1))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isLiked ? "primary" : "outline"}
      onClick={handleLike}
      disabled={isLoading}
      className="gap-2"
    >
      <Heart
        className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
      />
      {likes}
    </Button>
  )
}