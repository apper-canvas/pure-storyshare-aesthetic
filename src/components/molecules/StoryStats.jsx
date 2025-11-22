import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const StoryStats = ({ story, className }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  const stats = [
    {
      label: "Votes",
      value: formatNumber(story.totalVotes),
      icon: "Heart",
      color: "text-accent"
    },
    {
      label: "Views", 
      value: formatNumber(story.totalViews),
      icon: "Eye",
      color: "text-blue-500"
    },
    {
      label: "Comments",
      value: formatNumber(story.totalComments),
      icon: "MessageCircle",
      color: "text-green-500"
    },
    {
      label: "Chapters",
      value: story.chapterCount || 0,
      icon: "BookOpen",
      color: "text-purple-500"
    }
  ]

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:border-primary/20 transition-all duration-200"
        >
          <div className={cn("flex justify-center mb-2", stat.color)}>
            <ApperIcon name={stat.icon} className="h-5 w-5" />
          </div>
          <div className="text-lg font-bold text-gray-900 mb-1">
            {stat.value}
          </div>
          <div className="text-xs text-gray-500">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StoryStats