import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createStorySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000),
  coverImage: z.string().url().optional().or(z.literal("")),
  genre: z.string(),
  language: z.string(),
  mature: z.boolean(),
  status: z.enum(["ongoing", "completed", "on_hold"]),
  published: z.boolean(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createStorySchema.parse(body)

    // Create story
    const story = await prisma.story.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        coverImage: validatedData.coverImage || null,
        genre: validatedData.genre,
        language: validatedData.language,
        mature: validatedData.mature,
        status: validatedData.status,
        published: validatedData.published,
        authorId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      story,
      message: validatedData.published 
        ? "Story published successfully!" 
        : "Story saved as draft!",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Create story error:", error)
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    )
  }
}