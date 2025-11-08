import { PenSquare } from "lucide-react"

export default function WritePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <PenSquare className="h-16 w-16 text-[#FF6B6B] mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Write Your Story</h1>
        <p className="text-gray-600">
          This page will allow you to create and manage stories. Coming soon in Phase 5!
        </p>
      </div>
    </div>
  )
}