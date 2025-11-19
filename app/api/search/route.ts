import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const genre = searchParams.get("genre")
    const language = searchParams.get("language")
    const sortBy = searchParams.get("sort") || "relevance"

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        stories: [],
        count: 0,
        message: "Please enter a search term",
      })
    }

    // Build where clause
    const where: any = {
      published: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    }

    // Add filters
    if (genre && genre !== "all") {
      where.genre = genre
    }

    if (language && language !== "all") {
      where.language = language
    }

    // Build order by
    let orderBy: any = { updatedAt: "desc" } // default

    if (sortBy === "popular") {
      orderBy = { views: "desc" }
    } else if (sortBy === "recent") {
      orderBy = { createdAt: "desc" }
    } else if (sortBy === "likes") {
      orderBy = { likes: { _count: "desc" } }
    }

    // Fetch stories
    const stories = await prisma.story.findMany({
      where,
      orderBy,
      take: 50, // Limit results
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
            chapters: true,
            likes: true,
          },
        },
      },
    })

    return NextResponse.json({
      stories,
      count: stories.length,
      query,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Failed to search stories" },
      { status: 500 }
    )
  }
}
