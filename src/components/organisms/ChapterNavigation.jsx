import React from "react"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const ChapterNavigation = ({ 
  story, 
  currentChapter, 
  previousChapter, 
  nextChapter,
  onVote,
  onBookmark,
  isVoted = false,
  isBookmarked = false
}) => {
  return (
    <div className="bg-white border-t border-gray-100 sticky bottom-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Previous Chapter */}
          <div className="flex-1">
            {previousChapter ? (
              <Link
                to={`/story/${story.Id}/chapter/${previousChapter.Id}`}
                className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors duration-200"
              >
                <ApperIcon name="ChevronLeft" className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Previous: </span>
                <span className="truncate">{previousChapter.title}</span>
              </Link>
            ) : (
              <div></div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 mx-4">
            <Button
              variant={isVoted ? "accent" : "ghost"}
              size="sm"
              onClick={onVote}
              className="flex items-center space-x-1"
            >
              <ApperIcon name="Heart" className={`h-4 w-4 ${isVoted ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{currentChapter.votes}</span>
            </Button>

            <Button
              variant={isBookmarked ? "primary" : "ghost"}
              size="sm"
              onClick={onBookmark}
              className="flex items-center space-x-1"
            >
              <ApperIcon name="Bookmark" className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">Save</span>
            </Button>

            <Link to={`/story/${story.Id}`}>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <ApperIcon name="List" className="h-4 w-4" />
                <span className="hidden sm:inline">Chapters</span>
              </Button>
            </Link>
          </div>

          {/* Next Chapter */}
          <div className="flex-1 flex justify-end">
            {nextChapter ? (
              <Link
                to={`/story/${story.Id}/chapter/${nextChapter.Id}`}
                className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors duration-200"
              >
                <span className="truncate">{nextChapter.title}</span>
                <span className="hidden sm:inline"> :Next</span>
                <ApperIcon name="ChevronRight" className="h-4 w-4 ml-1" />
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterNavigation