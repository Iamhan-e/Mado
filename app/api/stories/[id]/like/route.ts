import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: storyId } = await params

    // Check if story exists
    const story = await prisma.story.findUnique({
      where: { id: storyId },
    })

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_storyId: {
          userId: session.user.id,
          storyId,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          userId_storyId: {
            userId: session.user.id,
            storyId,
          },
        },
      })

      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: session.user.id,
          storyId,
        },
      })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Like error:", error)
    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 }
    )
  }
}