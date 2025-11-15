import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import LikeButton from "@/components/like-button"
import Link from "next/link"
import { BookOpen, Eye, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StoryPageProps {
  params: Promise<{ id: string }>
}

export default async function StoryPage({ params }: StoryPageProps) {
  const session = await auth()
  const { id } = await params

  const story = await prisma.story.findUnique({
    where: { id, published: true },
    include: {
      author: {
        select: {
          name: true,
          username: true,
          avatar: true,
        },
      },
      chapters: {
        where: { published: true },
        orderBy: { number: "asc" },
        select: {
          id: true,
          title: true,
          number: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  })

  if (!story) {
    notFound()
  }

  // Increment view count
  await prisma.story.update({
    where: { id },
    data: { views: { increment: 1 } },
  })

  // Check if user has liked this story
  const userLike = session?.user?.id
    ? await prisma.like.findUnique({
        where: {
          userId_storyId: {
            userId: session.user.id,
            storyId: id,
          },
        },
      })
    : null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Story Cover & Info Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-surface rounded-xl shadow-md overflow-hidden sticky top-24 border border-gray-200">
              {/* Cover Image */}
              {story.coverImage ? (
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookOpen className="h-20 w-20 text-primary" />
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Author Info */}
                <Link
                  href={`/profile/${story.author.username}`}
                  className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors -mx-2"
                >
                  {story.author.avatar ? (
                    <img
                      src={story.author.avatar}
                      alt={story.author.name || "Author"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {story.author.name?.[0]?.toUpperCase() || "A"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-textPrimary truncate">
                      {story.author.name || story.author.username}
                    </p>
                    <p className="text-sm text-textSecondary">Author</p>
                  </div>
                </Link>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {story.chapters.length}
                    </p>
                    <p className="text-sm text-textSecondary">Chapters</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {story._count.likes}
                    </p>
                    <p className="text-sm text-textSecondary">Likes</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {story.chapters.length > 0 ? (
                    <Link href={`/chapter/${story.chapters[0].id}`}>
                      <Button variant="primary" className="w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Start Reading
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="primary" disabled className="w-full">
                      No Chapters Yet
                    </Button>
                  )}
                  <LikeButton
                    storyId={story.id}
                    initialLikes={story._count.likes}
                    initialIsLiked={!!userLike}
                    isAuthenticated={!!session?.user}
                  />
                </div>

                {/* Metadata */}
                <div className="space-y-2 text-sm text-textSecondary">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{story.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Updated{" "}
                      {new Date(story.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Published{" "}
                      {new Date(story.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {story.genre}
                  </span>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full capitalize">
                    {story.language}
                  </span>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    story.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : story.status === "ongoing"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {story.status === "completed" ? "✓ Completed" : 
                     story.status === "ongoing" ? "📖 Ongoing" : "⏸ On Hold"}
                  </span>
                  {story.mature && (
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                      18+ Mature
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8">
            {/* Title & Description */}
            <div className="bg-surface rounded-xl shadow-md p-8 border border-gray-200">
              <h1 className="text-4xl font-bold text-textPrimary mb-4">
                {story.title}
              </h1>
              <p className="text-textPrimary leading-relaxed whitespace-pre-wrap">
                {story.description}
              </p>
            </div>

            {/* Chapters List */}
            <div className="bg-surface rounded-xl shadow-md p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-textPrimary">
                  Table of Contents
                </h2>
                <span className="text-sm text-textSecondary">
                  {story.chapters.length} {story.chapters.length === 1 ? "chapter" : "chapters"}
                </span>
              </div>
              
              {story.chapters.length > 0 ? (
                <div className="space-y-2">
                  {story.chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/chapter/${chapter.id}`}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-primary group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-textPrimary group-hover:text-primary transition-colors">
                          Chapter {chapter.number}: {chapter.title}
                        </p>
                        <p className="text-sm text-textSecondary">
                          {new Date(chapter.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0 ml-4" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-textSecondary mb-2">No chapters published yet</p>
                  <p className="text-sm text-textSecondary">
                    Check back soon for updates!
                  </p>
                </div>
              )}
            </div>

            {/* Comments Section Placeholder */}
            <div className="bg-surface rounded-xl shadow-md p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-textPrimary mb-4">
                Comments
              </h2>
              <p className="text-textSecondary text-center py-8">
                Comments coming soon in Phase 6!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}