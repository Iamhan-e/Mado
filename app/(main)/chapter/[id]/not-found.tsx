import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Search } from "lucide-react"

export default function ChapterNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <BookOpen className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-textPrimary mb-2">
            Chapter Not Found
          </h1>
          <p className="text-textSecondary text-lg">
            This chapter doesn't exist or hasn't been published yet.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/browse">
            <Button variant="primary">
              <Search className="h-4 w-4 mr-2" />
              Browse Stories
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
