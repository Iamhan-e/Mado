import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username || username.length < 3) {
      return NextResponse.json(
        { available: false, message: "Username must be at least 3 characters" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    return NextResponse.json({
      available: !existingUser,
      message: existingUser ? "Username is taken" : "Username is available",
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check username" },
      { status: 500 }
    )
  }
}