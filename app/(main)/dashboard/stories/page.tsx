import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Edit, Eye, Trash2 } from "lucide-react"

export default async function StoriesDashboard() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const stories = await prisma.story.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      _count: {
        select: {
          chapters: true,
          likes: true,
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary mb-2">
              My Stories
            </h1>
            <p className="text-textSecondary">
              Manage your stories and chapters
            </p>
          </div>
          <Link href="/write">
            <Button variant="primary">
              <Plus className="h-5 w-5 mr-2" />
              New Story
            </Button>
          </Link>
        </div>

        {/* Stories List */}
        {stories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-surface rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
                {/* Cover */}
                {story.coverImage ? (
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary" />
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-textPrimary line-clamp-1">
                      {story.title}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      story.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {story.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className="text-sm text-textSecondary mb-3 line-clamp-2">
                    {story.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-textSecondary mb-4">
                    <span>{story._count.chapters} chapters</span>
                    <span>•</span>
                    <span>{story._count.likes} likes</span>
                    <span>•</span>
                    <span>{story.views} views</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/story/${story.id}`} className="flex-1">
                      <Button variant="outline" className="w-full text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/story/${story.id}/edit`} className="flex-1">
                      <Button variant="primary" className="w-full text-sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface rounded-xl border border-gray-200">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-textPrimary mb-2">
              No Stories Yet
            </h3>
            <p className="text-textSecondary mb-6">
              Start writing your first story and share it with the world!
            </p>
            <Link href="/write">
              <Button variant="primary">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Story
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}