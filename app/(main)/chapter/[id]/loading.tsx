export default function ChapterLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Skeleton */}
      <div className="bg-surface border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="flex-1 text-center space-y-2">
              <div className="h-3 w-32 bg-gray-200 rounded mx-auto" />
              <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-3/4 bg-gray-200 rounded" />
            <div className="flex items-center gap-4">
              <div className="h-6 w-6 rounded-full bg-gray-200" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="bg-surface rounded-xl shadow-md border border-gray-200 p-8 md:p-12">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Skeleton */}
          <div className="bg-surface rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex gap-4">
              <div className="flex-1 h-16 bg-gray-200 rounded" />
              <div className="flex-1 h-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}