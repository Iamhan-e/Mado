"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GENRES, LANGUAGES } from "@/lib/constants"
import { 
  FileText, 
  Image as ImageIcon, 
  Tag, 
  Globe, 
  AlertCircle,
  BookOpen,
  Eye,
  EyeOff
} from "lucide-react"

interface CreateStoryFormProps {
  userId: string
}

export default function CreateStoryForm({ userId }: CreateStoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    genre: "Romance",
    language: "amharic",
    mature: false,
    status: "ongoing" as "ongoing" | "completed" | "on_hold",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    
    setError("")
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required")
      return false
    }
    if (formData.title.trim().length < 3) {
      setError("Title must be at least 3 characters")
      return false
    }
    if (!formData.description.trim()) {
      setError("Description is required")
      return false
    }
    if (formData.description.trim().length < 20) {
      setError("Description must be at least 20 characters")
      return false
    }
    return true
  }

  const handleSubmit = async (published: boolean) => {
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/stories/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          published,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create story")
        setIsLoading(false)
        return
      }

      // Redirect to story page or dashboard
      if (published) {
        router.push(`/story/${data.story.id}`)
      } else {
        router.push(`/dashboard/stories`)
      }
      router.refresh()
    } catch (error) {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-textPrimary mb-2">
          Story Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            name="title"
            placeholder="Enter your story title"
            value={formData.title}
            onChange={handleChange}
            className="pl-11"
            maxLength={100}
            required
          />
        </div>
        <p className="mt-1 text-xs text-textSecondary">
          {formData.title.length}/100 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-textPrimary mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          placeholder="Write a compelling description for your story..."
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          rows={6}
          maxLength={1000}
          required
        />
        <p className="mt-1 text-xs text-textSecondary">
          {formData.description.length}/1000 characters
        </p>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-textPrimary mb-2">
          Cover Image URL <span className="text-textSecondary">(optional)</span>
        </label>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="url"
            name="coverImage"
            placeholder="https://example.com/cover.jpg"
            value={formData.coverImage}
            onChange={handleChange}
            className="pl-11"
          />
        </div>
        <p className="mt-1 text-xs text-textSecondary">
          Use a direct link to an image (recommended size: 400x600px)
        </p>
        {formData.coverImage && (
          <div className="mt-3">
            <img
              src={formData.coverImage}
              alt="Cover preview"
              className="h-40 w-auto rounded-lg object-cover border-2 border-gray-200"
              onError={(e) => {
                e.currentTarget.style.display = "none"
                setError("Invalid image URL")
              }}
            />
          </div>
        )}
      </div>

      {/* Genre and Language Row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Genre */}
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            <Tag className="inline h-4 w-4 mr-1" />
            Genre <span className="text-red-500">*</span>
          </label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          >
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            <Globe className="inline h-4 w-4 mr-1" />
            Language <span className="text-red-500">*</span>
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-textPrimary mb-2">
          Story Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>

      {/* Mature Content */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="mature"
            checked={formData.mature}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <div>
            <span className="font-medium text-textPrimary">
              Mature Content (18+)
            </span>
            <p className="text-sm text-textSecondary mt-1">
              Check this if your story contains mature themes, violence, or explicit content
            </p>
          </div>
        </label>
      </div>

      {/* Preview Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm text-primary hover:text-primary-dark flex items-center gap-2"
        >
          {showPreview ? (
            <>
              <EyeOff className="h-4 w-4" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Show Preview
            </>
          )}
        </button>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">
            Story Preview
          </h3>
          <div className="bg-surface rounded-xl shadow-md overflow-hidden border border-gray-200 max-w-sm">
            {/* Cover Image */}
            <div className="relative h-48">
              {formData.coverImage ? (
                <img
                  src={formData.coverImage}
                  alt={formData.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-primary" />
                </div>
              )}
              {formData.mature && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  18+
                </div>
              )}
            </div>
            {/* Info */}
            <div className="p-4">
              <h4 className="text-lg font-bold text-textPrimary mb-2 line-clamp-2">
                {formData.title || "Untitled Story"}
              </h4>
              <p className="text-sm text-textSecondary mb-3 line-clamp-3">
                {formData.description || "No description yet"}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {formData.genre}
                </span>
                <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full capitalize">
                  {formData.language}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSubmit(false)}
          disabled={isLoading}
          className="flex-1"
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => handleSubmit(true)}
          isLoading={isLoading}
          className="flex-1"
        >
          Publish Story
        </Button>
      </div>

      <p className="text-xs text-textSecondary text-center">
        You can add chapters to your story after creating it
      </p>
    </div>
  )
}