import Link from "next/link"
import { GENRES } from "@/lib/constants"
import { BookOpen } from "lucide-react"

export default function GenresPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse by Genre</h1>
        <p className="text-lg text-gray-600">
          Explore stories across different genres
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {GENRES.map((genre) => (
          <Link
            key={genre}
            href={`/browse?genre=${genre.toLowerCase()}`}
            className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-[#FF6B6B]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B6B]/20 to-[#00897B]/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="h-8 w-8 text-[#FF6B6B]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#FF6B6B] transition-colors">
                {genre}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Browse All Section */}
      <div className="mt-12 text-center">
        <Link
          href="/browse"
          className="inline-flex items-center text-[#FF6B6B] hover:text-[#ff5252] font-medium transition-colors"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          Browse All Stories
        </Link>
      </div>
    </div>
  )
}