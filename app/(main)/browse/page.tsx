import { prisma } from "@/lib/prisma"
import { GENRES, LANGUAGES } from "@/lib/constants"
import Link from "next/link"
import { BookOpen, Eye, Heart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import BrowseFilters from "@/components/browse-filters"

interface BrowsePageProps {
  searchParams: Promise<{
    genre?: string
    language?: string
    status?: string
    sort?: string
    search?: string
  }>
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams
  const { genre, language, status, sort = "recent", search } = params

  // Build filter conditions
  const where: any = {
    published: true,
  }

  if (genre) {
    where.genre = genre
  }

  if (language) {
    where.language = language
  }

  if (status) {
    where.status = status
  }

  if (search) {
  where.OR = [
    { title: { contains: search } },
    { description: { contains: search } },
  ]
}

  // Build sort conditions
  let orderBy: any = { createdAt: "desc" }
  
  if (sort === "popular") {
    orderBy = { views: "desc" }
  } else if (sort === "recent") {
    orderBy = { createdAt: "desc" }
  } else if (sort === "updated") {
    orderBy = { updatedAt: "desc" }
  }

  // Fetch stories
  const stories = await prisma.story.findMany({
    where,
    orderBy,
    include: {
      author: {
        select: {
          name: true,
          username: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          chapters: true,
          likes: true,
          comments: true,
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Browse Stories
          </h1>
          <p className="text-gray-600">
            Discover {stories.length} amazing {stories.length === 1 ? "story" : "stories"}
          </p>
        </div>

        {/* Filters */}
        <BrowseFilters
          currentGenre={genre}
          currentLanguage={language}
          currentStatus={status}
          currentSort={sort}
          currentSearch={search}
        />

        {/* Stories Grid */}
        {stories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/story/${story.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200"
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
                    <div className="w-full h-full bg-gradient-to-br from-[#FF6B6B]/20 to-[#00897B]/20 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-[#FF6B6B]" />
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
                    {story.status === "completed" ? "✓ Completed" : "📝 Ongoing"}
                  </div>
                </div>

                {/* Story Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#FF6B6B] transition-colors line-clamp-2">
                    {story.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
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
                      <div className="h-6 w-6 rounded-full bg-[#FF6B6B] flex items-center justify-center text-white text-xs">
                        {story.author.name?.[0] || "A"}
                      </div>
                    )}
                    <span className="text-sm text-gray-600">
                      {story.author.name || story.author.username}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
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
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-[#FF6B6B]/10 text-[#FF6B6B] rounded">
                    {story.genre}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No stories found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            <Link href="/browse">
              <Button variant="primary">Clear Filters</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}