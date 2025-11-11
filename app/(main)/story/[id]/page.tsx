import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Eye, Heart, Calendar, User, CheckCircle } from "lucide-react"
import LikeButton from "@/components/like-button"
import { Metadata } from "next"

interface StoryPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params
  
  const story = await prisma.story.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      coverImage: true,
    },
  })

  if (!story) {
    return {
      title: "Story Not Found",
    }
  }

  return {
    title: `${story.title} - Mado`,
    description: story.description,
    openGraph: {
      title: story.title,
      description: story.description,
      images: story.coverImage ? [story.coverImage] : [],
    },
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const session = await auth()
  const { id } = await params

  // Fetch story with all details
  const story = await prisma.story.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
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
          published: true,
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

  // Check if user has liked this story
  let isLiked = false
  if (session?.user?.id) {
    const like = await prisma.like.findUnique({
      where: {
        userId_storyId: {
          userId: session.user.id,
          storyId: story.id,
        },
      },
    })
    isLiked = !!like
  }

  // Increment view count
  await prisma.story.update({
    where: { id: story.id },
    data: { views: { increment: 1 } },
  })

  const isAuthor = session?.user?.id === story.authorId

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Story Header */}
      <div className="bg-gradient-to-br from-[#FF6B6B]/10 to-[#00897B]/10 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              {story.coverImage ? (
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full md:w-64 h-80 object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-full md:w-64 h-80 bg-gradient-to-br from-[#FF6B6B]/20 to-[#00897B]/20 rounded-xl shadow-lg flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-[#FF6B6B]" />
                </div>
              )}
            </div>

            {/* Story Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {story.title}
                  </h1>
                  
                  {/* Author */}
                  <Link
                    href={`/profile/${story.author.username}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#FF6B6B] transition-colors mb-4"
                  >
                    {story.author.avatar ? (
                      <img
                        src={story.author.avatar}
                        alt={story.author.name || "Author"}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#FF6B6B] flex items-center justify-center text-white text-sm">
                        {story.author.name?.[0] || "A"}
                      </div>
                    )}
                    <span className="font-medium">
                      {story.author.name || story.author.username}
                    </span>
                  </Link>
                </div>

                {isAuthor && (
                  <Link href={`/write/${story.id}`}>
                    <Button variant="outline">Edit Story</Button>
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{story.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{story._count.likes} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{story.chapters.length} chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(story.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {story.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full text-sm font-medium">
                  {story.genre}
                </span>
                <span className="px-3 py-1 bg-[#00897B]/10 text-[#00897B] rounded-full text-sm font-medium">
                  {story.language === "amharic" ? "አማርኛ" : "English"}
                </span>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                  {story.status === "completed" ? "✓ Completed" : "📝 Ongoing"}
                </span>
                {story.mature && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                    18+ Mature
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {story.chapters.length > 0 ? (
                  <Link href={`/chapter/${story.chapters[0].id}`}>
                    <Button variant="primary" className="px-8">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Start Reading
                    </Button>
                  </Link>
                ) : (
                  <Button variant="primary" disabled>
                    No Chapters Yet
                  </Button>
                )}

                <LikeButton
                  storyId={story.id}
                  initialLikes={story._count.likes}
                  initialIsLiked={isLiked}
                  isAuthenticated={!!session?.user}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Chapters ({story.chapters.length})
            </h2>
          </div>

          {story.chapters.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {story.chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/chapter/${chapter.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#FF6B6B]/10 rounded-lg flex items-center justify-center text-[#FF6B6B] font-bold">
                        {chapter.number}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#FF6B6B] transition-colors">
                          {chapter.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(chapter.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-[#FF6B6B] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p>No chapters published yet.</p>
              {isAuthor && (
                <Link href={`/write/${story.id}`} className="mt-4 inline-block">
                  <Button variant="primary">Add First Chapter</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}