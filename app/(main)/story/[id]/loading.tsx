export default function StoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar Skeleton */}
          <div className="md:col-span-1">
            <div className="bg-surface rounded-xl shadow-md overflow-hidden border border-gray-200 animate-pulse">
              <div className="w-full h-64 bg-gray-200" />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                  <div className="text-center space-y-2">
                    <div className="h-8 bg-gray-200 rounded mx-auto w-12" />
                    <div className="h-3 bg-gray-200 rounded" />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="h-8 bg-gray-200 rounded mx-auto w-12" />
                    <div className="h-3 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-12 bg-gray-200 rounded" />
                  <div className="h-12 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-surface rounded-xl shadow-md p-8 border border-gray-200 animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
            <div className="bg-surface rounded-xl shadow-md p-8 border border-gray-200 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}