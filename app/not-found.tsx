import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <FileQuestion className="h-24 w-24 text-gray-300 mx-auto mb-4" />
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">
          Page Not Found
        </h2>
        <p className="text-textSecondary mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">Go Home</Button>
          </Link>
          <Link href="/browse">
            <Button variant="outline">Browse Stories</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}