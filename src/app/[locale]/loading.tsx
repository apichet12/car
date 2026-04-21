export default function Loading() {
  return (
    <div className="min-h-screen bg-black py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="skeleton h-10 w-48 rounded-xl mb-2" />
        <div className="skeleton h-5 w-32 rounded-lg mb-8" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="skeleton h-48" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-5 rounded-lg w-3/4" />
                <div className="skeleton h-4 rounded-lg w-1/2" />
                <div className="flex gap-2 mt-4">
                  <div className="skeleton h-9 rounded-xl flex-1" />
                  <div className="skeleton h-9 rounded-xl flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
