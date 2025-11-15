import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import EditProfileForm from "@/components/edit-profile-form"
import { prisma } from "@/lib/prisma"

export default async function SettingsProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatar: true,
      email: true,
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textPrimary mb-2">Edit Profile</h1>
        <p className="text-textSecondary">Update your profile information</p>
      </div>

      <div className="bg-surface rounded-xl shadow-md border border-gray-200 p-8">
        <EditProfileForm 
          user={{
            id: user.id,
            name: user.name,
            username: user.username,
            bio: user.bio,
            avatar: user.avatar,
            email: user.email,
          }} 
        />
      </div>
    </div>
  )
}