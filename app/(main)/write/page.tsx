import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import CreateStoryForm from "@/components/create-story-form"
import { PenSquare } from "lucide-react"

export default async function WritePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <PenSquare className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-textPrimary">
                Create New Story
              </h1>
              <p className="text-textSecondary">
                Share your story with the world
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-surface rounded-xl shadow-md border border-gray-200 p-8">
          <CreateStoryForm userId={session.user.id} />
        </div>
      </div>
    </div>
  )
}