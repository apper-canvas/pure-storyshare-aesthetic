import React from "react"

const Loading = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"></div>
            <div className="hidden md:flex space-x-6">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block w-64 space-y-6">
            <div className="space-y-3">
              <div className="h-5 w-20 bg-gray-300 rounded animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-5 w-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Grid Skeleton */}
          <div className="flex-1">
            <div className="mb-8 space-y-4">
              <div className="h-8 w-48 bg-gradient-to-r from-gray-300 to-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="card-lift bg-surface rounded-xl p-6 paper-texture">
                  <div className="space-y-4">
                    {/* Cover Image */}
                    <div className="h-48 bg-gradient-to-br from-gray-300 to-gray-200 rounded-lg animate-pulse"></div>
                    
                    {/* Title */}
                    <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                    
                    {/* Author */}
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    
                    {/* Description */}
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Genre Tags */}
                    <div className="flex gap-2 flex-wrap">
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex space-x-4">
                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading