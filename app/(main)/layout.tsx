import Navbar from "@/components/navbar" // Correct: default import

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-parchment text-text-primary">
        {children}
      </main>
    </>
  )
}