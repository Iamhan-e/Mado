import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  bio: z.string().max(200).optional(),
  avatar: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true
        // Allow common image URLs
        try {
          const url = new URL(val)
          return (
            url.protocol === "http:" || 
            url.protocol === "https:"
          )
        } catch {
          return false
        }
      },
      { message: "Avatar must be a valid HTTP/HTTPS URL" }
    ),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        bio: validatedData.bio,
        avatar: validatedData.avatar || null,
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        avatar: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Update profile error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}