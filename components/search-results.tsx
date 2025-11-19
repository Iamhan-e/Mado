import Link from "next/link"
import { BookOpen, Eye, Heart, Search as SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchResultsProps {
  query: string
  genre?: string
  language?: string
  sort?: string
}

interface Story {
  id: string
  title: string
  description: string
  coverImage: string | null
  genre: string
  language: string
  mature: boolean
  status: string
  views: number
  author: {
    name: string | null
    username: string | null
    avatar: string | null
  }
  _count: {
    chapters: number
    likes: number
  }
}

export default async function SearchResults({
  query,
  genre,
  language,
  sort,
}: SearchResultsProps) {
  if (!query || query.trim().length === 0) {
    return (
      <div className="text-center py-16 bg-surface rounded-xl border border-gray-200">
        <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-textPrimary mb-2">
          Start Your Search
        </h3>
        <p className="text-textSecondary">
          Enter a keyword to find stories
        </p>
      </div>
    )
  }

  // Fetch search results
  const params = new URLSearchParams()
  params.set("q", query)
  if (genre) params.set("genre", genre)
  if (language) params.set("language", language)
  if (sort) params.set("sort", sort)

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/search?${params.toString()}`,
    { cache: "no-store" }
  )

  const data = await response.json()
  const stories: Story[] = data.stories || []

  if (stories.length === 0) {
    return (
      <div className="text-center py-16 bg-surface rounded-xl border border-gray-200">
        <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-textPrimary mb-2">
          No Results Found
        </h3>
        <p className="text-textSecondary mb-4">
          We couldn't find any stories matching "{query}"
        </p>
        <p className="text-sm text-textSecondary mb-6">
          Try adjusting your search terms or filters
        </p>
        <Link href="/browse">
          <Button variant="primary">Browse All Stories</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-textSecondary">
          Found <span className="font-semibold text-textPrimary">{stories.length}</span>{" "}
          {stories.length === 1 ? "story" : "stories"} matching "{query}"
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/story/${story.id}`}
            className="bg-surface rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200"
          >
            {/* Cover Image */}
            <div className="relative h-48 overflow-hidden">
              {story.coverImage ? (
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-primary" />
                </div>
              )}

              {/* Mature Badge */}
              {story.mature && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  18+
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded backdrop-blur-sm">
                {story.status === "completed" ? "✓ Completed" : "📖 Ongoing"}
              </div>
            </div>

            {/* Story Info */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-textPrimary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {story.title}
              </h3>

              <p className="text-sm text-textSecondary mb-3 line-clamp-2">
                {story.description}
              </p>

              {/* Author */}
              <div className="flex items-center gap-2 mb-3">
                {story.author.avatar ? (
                  <img
                    src={story.author.avatar}
                    alt={story.author.name || "Author"}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                    {story.author.name?.[0] || "A"}
                  </div>
                )}
                <span className="text-sm text-textSecondary">
                  {story.author.name || story.author.username}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-textSecondary mb-3">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {story._count.chapters}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {story._count.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {story.views}
                </span>
              </div>

              {/* Genre Badge */}
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                {story.genre}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
