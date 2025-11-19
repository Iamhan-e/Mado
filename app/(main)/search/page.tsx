import { Suspense } from "react"
import SearchResults from "@/components/search-results"
import SearchBar from "@/components/search-bar"
import { Search } from "lucide-react"

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    genre?: string
    language?: string
    sort?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ""

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-textPrimary">
              Search Stories
            </h1>
          </div>
          <p className="text-textSecondary">
            Find your next great read
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar initialQuery={query} />
        </div>

        {/* Results */}
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults 
            query={query}
            genre={params.genre}
            language={params.language}
            sort={params.sort}
          />
        </Suspense>
      </div>
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-surface rounded-xl shadow-md overflow-hidden border border-gray-200 animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}