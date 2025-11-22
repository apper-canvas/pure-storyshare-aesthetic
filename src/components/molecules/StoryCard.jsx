import React from "react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import { cn } from "@/utils/cn"

const StoryCard = ({ story, showAuthor = true, className }) => {
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "complete":
        return "success"
      case "ongoing":
        return "primary"
      default:
        return "default"
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  return (
    <div className={cn("card-lift bg-surface rounded-xl paper-texture", className)}>
      <Link to={`/story/${story.Id}`} className="block">
        {/* Cover Image */}
        <div className="relative h-48 rounded-t-xl overflow-hidden">
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between">
              <Badge 
                variant={getStatusBadgeVariant(story.status)}
                className="text-xs font-medium"
              >
                {story.status === "complete" ? "Complete" : "Ongoing"}
              </Badge>
              {story.mature && (
                <Badge variant="error" className="text-xs">
                  Mature
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="font-display font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors duration-200">
            {story.title}
          </h3>

          {/* Author */}
          {showAuthor && story.author && (
            <p className="text-sm text-gray-600 mb-3 flex items-center">
              <ApperIcon name="User" className="h-3 w-3 mr-1" />
              <span className="hover:text-primary transition-colors duration-200">
                {story.author.displayName}
              </span>
            </p>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {story.description}
          </p>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {story.genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
            {story.genres.length > 2 && (
              <Badge variant="default" className="text-xs">
                +{story.genres.length - 2}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <ApperIcon name="Heart" className="h-4 w-4 mr-1 text-accent" />
                <span>{formatNumber(story.totalVotes)}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Eye" className="h-4 w-4 mr-1" />
                <span>{formatNumber(story.totalViews)}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="MessageCircle" className="h-4 w-4 mr-1" />
                <span>{formatNumber(story.totalComments)}</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {story.chapterCount} chapters
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-3 text-xs text-gray-400">
            Updated {format(new Date(story.updatedAt), "MMM d, yyyy")}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default StoryCard