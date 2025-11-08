import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Edit } from "lucide-react"

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await auth()
  const { username } = await params  // ← Add await here

  // Fetch user data with all needed relations
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      stories: {
        where: { 
          published: true 
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          followers: true,
          following: true,
          stories: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // Get counts for each story separately
  const storiesWithCounts = await Promise.all(
    user.stories.map(async (story) => {
      const counts = await prisma.story.findUnique({
        where: { id: story.id },
        select: {
          _count: {
            select: {
              chapters: true,
              likes: true,
            },
          },
        },
      })
      return {
        ...story,
        _count: counts?._count || { chapters: 0, likes: 0 },
      }
    })
  )

  const isOwnProfile = session?.user?.id === user.id

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#FF6B6B]/10 to-[#00897B]/10 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || user.username || "User"}
                  className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg bg-[#FF6B6B] flex items-center justify-center text-white text-4xl font-bold">
                  {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {user.name || user.username}
                  </h1>
                  <p className="text-gray-600">@{user.username}</p>
                </div>

                {isOwnProfile && (
                  <Link href="/profile/edit">
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-gray-700 mb-4 max-w-2xl">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-bold text-gray-900">
                    {user._count.stories}
                  </span>
                  <span className="text-gray-600 ml-1">Stories</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">
                    {user._count.followers}
                  </span>
                  <span className="text-gray-600 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">
                    {user._count.following}
                  </span>
                  <span className="text-gray-600 ml-1">Following</span>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-center text-sm text-gray-500 mt-3">
                <Calendar className="h-4 w-4 mr-1" />
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isOwnProfile ? "My Stories" : `Stories by ${user.name || user.username}`}
          </h2>
          <p className="text-gray-600">
            {storiesWithCounts.length} published {storiesWithCounts.length === 1 ? "story" : "stories"}
          </p>
        </div>

        {storiesWithCounts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {storiesWithCounts.map((story) => (
              <Link
                key={story.id}
                href={`/story/${story.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden group"
              >
                <div className="flex">
                  {/* Cover Image */}
                  {story.coverImage ? (
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-32 h-40 object-cover"
                    />
                  ) : (
                    <div className="w-32 h-40 bg-gradient-to-br from-[#FF6B6B]/20 to-[#00897B]/20 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-[#FF6B6B]" />
                    </div>
                  )}

                  {/* Story Info */}
                  <div className="flex-1 p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#FF6B6B] transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {story.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {story._count.chapters} chapters
                      </span>
                      <span className="flex items-center">
                        ❤️ {story._count.likes}
                      </span>
                      <span className="flex items-center">
                        👁️ {story.views}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-[#FF6B6B]/10 text-[#FF6B6B] rounded">
                        {story.genre}
                      </span>
                      {story.mature && (
                        <span className="inline-block ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                          Mature
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {isOwnProfile
                ? "You haven't published any stories yet"
                : "This user hasn't published any stories yet"}
            </p>
            {isOwnProfile && (
              <Link href="/write">
                <Button variant="primary">Write Your First Story</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}