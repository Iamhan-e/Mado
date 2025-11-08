import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, TrendingUp, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FF6B6B]/10 via-white to-[#00897B]/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Share Your Stories in{" "}
              <span className="text-[#FF6B6B]">Amharic</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join a community of readers and writers. Discover amazing stories
              or share your own creative works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button variant="primary" className="text-lg px-8 py-4">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Reading
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="text-lg px-8 py-4">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Writing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6B6B]/10 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-[#FF6B6B]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Stories</h3>
              <p className="text-gray-600">
                Explore thousands of stories across various genres
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00897B]/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-[#00897B]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join Community</h3>
              <p className="text-gray-600">
                Connect with fellow readers and writers
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFD54F]/10 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-[#FFD54F]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Grow Your Audience</h3>
              <p className="text-gray-600">
                Share your work and build your readership
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FF6B6B]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join Mado today and become part of our storytelling community
          </p>
          <Link href="/register">
            <Button
              variant="outline"
              className="bg-white text-[#FF6B6B] hover:bg-gray-100 text-lg px-8 py-4"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}