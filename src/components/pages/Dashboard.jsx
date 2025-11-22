import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import storyService from "@/services/api/storyService"

const Dashboard = () => {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("published")

  const loadStories = async () => {
    try {
      setLoading(true)
      setError("")
      const userStories = await storyService.getStoriesByAuthor("user1") // Current user
      setStories(userStories)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStories()
  }, [])

  const getFilteredStories = () => {
    switch (activeTab) {
      case "published":
        return stories.filter(story => story.chapterCount > 0)
      case "drafts":
        return stories.filter(story => story.chapterCount === 0)
      default:
        return stories
    }
  }

  const getTotalStats = () => {
    return stories.reduce(
      (acc, story) => ({
        totalVotes: acc.totalVotes + story.totalVotes,
        totalViews: acc.totalViews + story.totalViews,
        totalComments: acc.totalComments + story.totalComments,
        totalWords: acc.totalWords + story.wordCount
      }),
      { totalVotes: 0, totalViews: 0, totalComments: 0, totalWords: 0 }
    )
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadStories} />
  }

  const totalStats = getTotalStats()
  const filteredStories = getFilteredStories()

  const tabs = [
    { 
      key: "published", 
      label: "Published", 
      icon: "BookOpen",
      count: stories.filter(s => s.chapterCount > 0).length
    },
    { 
      key: "drafts", 
      label: "Drafts", 
      icon: "Edit3",
      count: stories.filter(s => s.chapterCount === 0).length
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2">
              Writer Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your stories and track your writing progress
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to="/write">
              <Button className="flex items-center space-x-2">
                <ApperIcon name="Plus" className="h-4 w-4" />
                <span>New Story</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface rounded-xl p-6 paper-texture">
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="Heart" className="h-5 w-5 text-accent" />
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(totalStats.totalVotes)}
            </div>
            <div className="text-xs text-gray-500">Votes</div>
          </div>

          <div className="bg-surface rounded-xl p-6 paper-texture">
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="Eye" className="h-5 w-5 text-blue-500" />
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(totalStats.totalViews)}
            </div>
            <div className="text-xs text-gray-500">Views</div>
          </div>

          <div className="bg-surface rounded-xl p-6 paper-texture">
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="MessageCircle" className="h-5 w-5 text-green-500" />
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(totalStats.totalComments)}
            </div>
            <div className="text-xs text-gray-500">Comments</div>
          </div>

          <div className="bg-surface rounded-xl p-6 paper-texture">
            <div className="flex items-center justify-between mb-2">
              <ApperIcon name="FileText" className="h-5 w-5 text-purple-500" />
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(totalStats.totalWords)}
            </div>
            <div className="text-xs text-gray-500">Words</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ApperIcon name={tab.icon} className="h-4 w-4" />
              <span>{tab.label}</span>
              <Badge variant="default" className="text-xs">
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>

        {/* Stories List */}
        {filteredStories.length === 0 ? (
          <Empty
            type={activeTab === "drafts" ? "drafts" : "stories"}
            onAction={() => window.location.href = "/write"}
          />
        ) : (
          <div className="space-y-4">
            {filteredStories.map((story) => (
              <div
                key={story.Id}
                className="bg-surface rounded-xl p-6 paper-texture hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-6">
                  {/* Cover Image */}
                  <Link to={`/story/${story.Id}`} className="flex-shrink-0">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-16 h-24 sm:w-20 sm:h-30 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    />
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link
                          to={`/story/${story.Id}`}
                          className="text-lg font-display font-bold text-gray-900 hover:text-primary transition-colors duration-200"
                        >
                          {story.title}
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={story.status === "complete" ? "success" : "primary"}>
                            {story.status === "complete" ? "Complete" : "Ongoing"}
                          </Badge>
                          {story.chapterCount === 0 && (
                            <Badge variant="warning">Draft</Badge>
                          )}
                          {story.genres.slice(0, 2).map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Link to={`/edit/${story.Id}`}>
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <ApperIcon name="Edit3" className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </Link>
                        <Link to={`/story/${story.Id}`}>
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <ApperIcon name="ExternalLink" className="h-4 w-4" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {story.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="BookOpen" className="h-4 w-4" />
                          <span>{story.chapterCount} chapters</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Heart" className="h-4 w-4 text-accent" />
                          <span>{formatNumber(story.totalVotes)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Eye" className="h-4 w-4" />
                          <span>{formatNumber(story.totalViews)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="MessageCircle" className="h-4 w-4" />
                          <span>{formatNumber(story.totalComments)}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Updated {format(new Date(story.updatedAt), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard