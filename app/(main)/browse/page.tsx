import { BookOpen } from "lucide-react"

export default function BrowsePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <BookOpen className="h-16 w-16 text-[#FF6B6B] mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Stories</h1>
        <p className="text-gray-600">
          This page will display all available stories. Coming soon in Phase 4!
        </p>
      </div>
    </div>
  )
}