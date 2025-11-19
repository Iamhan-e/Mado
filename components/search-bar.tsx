"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import { GENRES, LANGUAGES } from "@/lib/constants"

interface SearchBarProps {
  initialQuery?: string
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    genre: searchParams.get("genre") || "all",
    language: searchParams.get("language") || "all",
    sort: searchParams.get("sort") || "relevance",
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const params = new URLSearchParams()
    params.set("q", query.trim())
    
    if (filters.genre !== "all") params.set("genre", filters.genre)
    if (filters.language !== "all") params.set("language", filters.language)
    if (filters.sort !== "relevance") params.set("sort", filters.sort)

    router.push(`/search?${params.toString()}`)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Auto-apply filters if there's a search query
    if (query.trim()) {
      const params = new URLSearchParams()
      params.set("q", query.trim())
      
      if (newFilters.genre !== "all") params.set("genre", newFilters.genre)
      if (newFilters.language !== "all") params.set("language", newFilters.language)
      if (newFilters.sort !== "relevance") params.set("sort", newFilters.sort)

      router.push(`/search?${params.toString()}`)
    }
  }

  const clearFilters = () => {
    setFilters({
      genre: "all",
      language: "all",
      sort: "relevance",
    })
    if (query.trim()) {
      router.push(`/search?q=${query.trim()}`)
    }
  }

  const hasActiveFilters = filters.genre !== "all" || 
                          filters.language !== "all" || 
                          filters.sort !== "relevance"

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by title, description, or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 h-12 text-base"
          />
        </div>
        <Button type="submit" variant="primary" className="h-12 px-6">
          <Search className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Search</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="h-12 px-4"
        >
          <Filter className="h-5 w-5" />
          {hasActiveFilters && (
            <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-surface rounded-xl p-6 shadow-md border border-gray-200 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-textPrimary">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Genre
              </label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange("genre", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Language
              </label>
              <select
                value={filters.language}
                onChange={(e) => handleFilterChange("language", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Languages</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="relevance">Most Relevant</option>
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}