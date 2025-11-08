import { BookOpen } from "lucide-react"

interface ChapterPageProps {
  params: Promise<{ id: string }>
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id } = await params
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <BookOpen className="h-16 w-16 text-[#FF6B6B] mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Chapter Reader</h1>
        <p className="text-gray-600">
          Chapter ID: {id}
        </p>
        <p className="text-gray-600 mt-2">
          This page will display chapter content. Coming soon in Phase 4!
        </p>
      </div>
    </div>
  )
}