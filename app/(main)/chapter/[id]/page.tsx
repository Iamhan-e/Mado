import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Home,
  List,
  MessageSquare,
  Heart
} from "lucide-react"
import LikeButton from "@/components/like-button"

interface ChapterPageProps {
  params: Promise<{ id: string }>
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const session = await auth()
  const { id } = await params

  // Fetch chapter with story and navigation info
  const chapter = await prisma.chapter.findUnique({
    where: { id, published: true },
    include: {
      story: {
        include: {
          author: {
            select: {
              name: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      },
    },
  })

  if (!chapter || !chapter.story.published) {
    notFound()
  }

  // Get previous and next chapters
  const previousChapter = await prisma.chapter.findFirst({
    where: {
      storyId: chapter.storyId,
      number: chapter.number - 1,
      published: true,
    },
    select: { id: true, number: true, title: true },
  })

  const nextChapter = await prisma.chapter.findFirst({
    where: {
      storyId: chapter.storyId,
      number: chapter.number + 1,
      published: true,
    },
    select: { id: true, number: true, title: true },
  })

  // Get all chapters for table of contents
  const allChapters = await prisma.chapter.findMany({
    where: {
      storyId: chapter.storyId,
      published: true,
    },
    orderBy: { number: "asc" },
    select: {
      id: true,
      number: true,
      title: true,
    },
  })

  // Check if user has liked the story
  const userLike = session?.user?.id
    ? await prisma.like.findUnique({
        where: {
          userId_storyId: {
            userId: session.user.id,
            storyId: chapter.storyId,
          },
        },
      })
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="bg-surface border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back to Story */}
            <Link
              href={`/story/${chapter.storyId}`}
              className="flex items-center gap-2 text-textSecondary hover:text-primary transition-colors text-sm"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Story</span>
            </Link>

            {/* Center: Chapter Info */}
            <div className="flex-1 text-center min-w-0">
              <p className="text-xs text-textSecondary truncate">
                {chapter.story.title}
              </p>
              <p className="text-sm font-medium text-textPrimary truncate">
                Chapter {chapter.number}: {chapter.title}
              </p>
            </div>

            {/* Right: Table of Contents */}
            <a
              href="#toc"
              className="flex items-center gap-2 text-textSecondary hover:text-primary transition-colors text-sm"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Chapters</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chapter Header */}
        <div className="mb-8">
          <Link
            href={`/story/${chapter.storyId}`}
            className="inline-flex items-center text-textSecondary hover:text-primary transition-colors mb-4 text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {chapter.story.title}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-2">
            Chapter {chapter.number}: {chapter.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-textSecondary">
            <Link
              href={`/profile/${chapter.story.author.username}`}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              {chapter.story.author.avatar ? (
                <img
                  src={chapter.story.author.avatar}
                  alt={chapter.story.author.name || "Author"}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                  {chapter.story.author.name?.[0]?.toUpperCase() || "A"}
                </div>
              )}
              <span>{chapter.story.author.name || chapter.story.author.username}</span>
            </Link>
            <span>•</span>
            <span>
              {new Date(chapter.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Chapter Content */}
        <article className="bg-surface rounded-xl shadow-md border border-gray-200 p-8 md:p-12 mb-8">
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-textPrimary 
              prose-p:text-textPrimary prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-textPrimary
              prose-em:text-textPrimary"
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.8',
            }}
          >
            {chapter.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ) : (
                <br key={index} />
              )
            ))}
          </div>
        </article>

        {/* Chapter Navigation */}
        <div className="bg-surface rounded-xl shadow-md border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between gap-4">
            {/* Previous Chapter */}
            <div className="flex-1">
              {previousChapter ? (
                <Link href={`/chapter/${previousChapter.id}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    <div className="text-left min-w-0">
                      <div className="text-xs text-textSecondary">Previous</div>
                      <div className="text-sm font-medium truncate">
                        Ch. {previousChapter.number}: {previousChapter.title}
                      </div>
                    </div>
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled className="w-full justify-start opacity-50">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="text-xs">First Chapter</div>
                  </div>
                </Button>
              )}
            </div>

            {/* Next Chapter */}
            <div className="flex-1">
              {nextChapter ? (
                <Link href={`/chapter/${nextChapter.id}`}>
                  <Button variant="primary" className="w-full justify-end">
                    <div className="text-right min-w-0">
                      <div className="text-xs opacity-90">Next</div>
                      <div className="text-sm font-medium truncate">
                        Ch. {nextChapter.number}: {nextChapter.title}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled className="w-full justify-end opacity-50">
                  <div className="text-right">
                    <div className="text-xs">Last Chapter</div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Story Actions */}
        <div className="bg-surface rounded-xl shadow-md border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">
            Enjoying this story?
          </h3>
          <div className="flex flex-wrap gap-3">
            <LikeButton
              storyId={chapter.storyId}
              initialLikes={chapter.story._count.likes}
              initialIsLiked={!!userLike}
              isAuthenticated={!!session?.user}
            />
            <Link href={`/story/${chapter.storyId}#comments`}>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Leave a Comment
              </Button>
            </Link>
            <Link href={`/profile/${chapter.story.author.username}`}>
              <Button variant="outline">
                Follow Author
              </Button>
            </Link>
          </div>
        </div>

        {/* Table of Contents */}
        <div id="toc" className="bg-surface rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-textPrimary mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            All Chapters
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allChapters.map((ch) => (
              <Link
                key={ch.id}
                href={`/chapter/${ch.id}`}
                className={`block p-3 rounded-lg transition-colors ${
                  ch.id === chapter.id
                    ? "bg-primary/10 border-2 border-primary"
                    : "hover:bg-gray-50 border-2 border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${
                      ch.id === chapter.id ? "text-primary" : "text-textPrimary"
                    }`}>
                      Chapter {ch.number}: {ch.title}
                    </p>
                  </div>
                  {ch.id === chapter.id && (
                    <span className="ml-2 text-xs font-medium text-primary flex-shrink-0">
                      Current
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}