import React from "react"
import StoryCard from "@/components/molecules/StoryCard"
import Empty from "@/components/ui/Empty"
import { cn } from "@/utils/cn"

const StoryGrid = ({ 
  stories, 
  loading = false, 
  emptyState,
  className 
}) => {
  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {[...Array(9)].map((_, index) => (
          <div key={index} className="card-lift bg-surface rounded-xl p-6 paper-texture animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex justify-between pt-2">
                <div className="flex space-x-4">
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stories || stories.length === 0) {
    return emptyState || (
      <Empty 
        type="stories"
        onAction={() => window.location.href = "/write"}
      />
    )
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {stories.map((story) => (
        <StoryCard key={story.Id} story={story} />
      ))}
    </div>
  )
}

export default StoryGrid