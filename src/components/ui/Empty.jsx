import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  type = "stories", 
  title, 
  description, 
  actionText,
  onAction,
  icon = "BookOpen"
}) => {
  const defaultContent = {
    stories: {
      title: "No Stories Found",
      description: "Looks like there are no stories matching your criteria. Why not start writing one?",
      actionText: "Start Writing",
      icon: "PenTool"
    },
    reading: {
      title: "Your Reading List is Empty",
      description: "Discover amazing stories and add them to your reading list to get started.",
      actionText: "Browse Stories",
      icon: "BookOpen"
    },
    chapters: {
      title: "No Chapters Yet",
      description: "This story hasn't been started yet. Check back soon for the first chapter!",
      actionText: "Browse Other Stories",
      icon: "FileText"
    },
    drafts: {
      title: "No Drafts in Progress",
      description: "You don't have any story drafts. Ready to start your next masterpiece?",
      actionText: "Create New Story",
      icon: "Edit3"
    },
    comments: {
      title: "No Comments Yet",
      description: "Be the first to share your thoughts on this chapter!",
      actionText: "Add Comment",
      icon: "MessageCircle"
    }
  }

  const content = defaultContent[type] || defaultContent.stories
  const finalTitle = title || content.title
  const finalDescription = description || content.description
  const finalActionText = actionText || content.actionText
  const finalIcon = icon || content.icon

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name={finalIcon} className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
            {finalTitle}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {finalDescription}
          </p>
        </div>

        {onAction && (
          <button
            onClick={onAction}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            <span>{finalActionText}</span>
          </button>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Book" className="h-4 w-4" />
              <span>Discover</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Heart" className="h-4 w-4" />
              <span>Enjoy</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Share2" className="h-4 w-4" />
              <span>Share</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Empty