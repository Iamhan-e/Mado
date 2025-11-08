"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { GENRES, LANGUAGES } from "@/lib/constants"

interface BrowseFiltersProps {
  currentGenre?: string
  currentLanguage?: string
  currentStatus?: string
  currentSort?: string
  currentSearch?: string
}

export default function BrowseFilters({
  currentGenre,
  currentLanguage,
  currentStatus,
  currentSort,
  currentSearch,
}: BrowseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch || "")
  const [showFilters, setShowFilters] = useState(false)

  const updateParams = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    router.push(`/browse?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams("search", search)
  }

  const clearFilters = () => {
    setSearch("")
    router.push("/browse")
  }

  const hasActiveFilters = currentGenre || currentLanguage || currentStatus || currentSearch

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search stories by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
          />
        </div>
        <Button type="submit" variant="primary">
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </form>

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 space-y-4">
          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <select
              value={currentGenre || "all"}
              onChange={(e) => updateParams("genre", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20"
            >
              <option value="all">All Genres</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={currentLanguage || "all"}
              onChange={(e) => updateParams("language", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20"
            >
              <option value="all">All Languages</option>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={currentStatus || "all"}
              onChange={(e) => updateParams("status", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20"
            >
              <option value="all">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={currentSort || "recent"}
              onChange={(e) => updateParams("sort", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}