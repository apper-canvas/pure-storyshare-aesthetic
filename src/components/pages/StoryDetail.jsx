import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { toast } from "react-toastify"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import StoryStats from "@/components/molecules/StoryStats"
import storyService from "@/services/api/storyService"

const StoryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isVoted, setIsVoted] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  const loadStory = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError("")
      const storyData = await storyService.getStoryById(id)
      setStory(storyData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStory()
  }, [id])

  const handleVote = async () => {
    if (!story) return
    
    try {
      await storyService.voteForStory(story.Id)
      setIsVoted(true)
      setStory(prev => ({
        ...prev,
        totalVotes: prev.totalVotes + 1
      }))
      toast.success("Vote added!")
    } catch (err) {
      toast.error("Failed to vote")
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? "Removed from reading list" : "Added to reading list")
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast.success(isFollowing ? "Unfollowed author" : "Following author")
  }

  const startReading = () => {
    if (story?.chapters?.[0]) {
      navigate(`/story/${story.Id}/chapter/${story.chapters[0].Id}`)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadStory} />
  }

  if (!story) {
    return <ErrorView message="Story not found" />
  }

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start gap-6">
                {/* Cover Image */}
                <div className="flex-shrink-0">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-32 h-48 sm:w-48 sm:h-72 object-cover rounded-xl shadow-lg"
                  />
                </div>

                {/* Title and Meta */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
                    {story.title}
                  </h1>

                  {/* Author */}
                  {story.author && (
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={story.author.avatar}
                        alt={story.author.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <Link
                          to={`/profile/${story.author.username}`}
                          className="font-medium text-gray-900 hover:text-primary transition-colors"
                        >
                          {story.author.displayName}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {story.author.followersCount} followers
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant={getStatusBadgeVariant(story.status)}>
                      {story.status === "complete" ? "Complete" : "Ongoing"}
                    </Badge>
                    {story.mature && (
                      <Badge variant="error">Mature Content</Badge>
                    )}
                    {story.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={startReading} className="flex items-center space-x-2">
                      <ApperIcon name="BookOpen" className="h-4 w-4" />
                      <span>Start Reading</span>
                    </Button>

                    <Button
                      variant={isVoted ? "accent" : "secondary"}
                      onClick={handleVote}
                      className="flex items-center space-x-2"
                    >
                      <ApperIcon name="Heart" className={`h-4 w-4 ${isVoted ? "fill-current" : ""}`} />
                      <span>Vote</span>
                    </Button>

                    <Button
                      variant={isBookmarked ? "primary" : "secondary"}
                      onClick={handleBookmark}
                      className="flex items-center space-x-2"
                    >
                      <ApperIcon name="Bookmark" className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                      <span>Add to List</span>
                    </Button>

                    <Button
                      variant={isFollowing ? "primary" : "secondary"}
                      onClick={handleFollow}
                      className="flex items-center space-x-2"
                    >
                      <ApperIcon name="UserPlus" className="h-4 w-4" />
                      <span>{isFollowing ? "Following" : "Follow"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <StoryStats story={story} className="mb-8" />

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-display font-bold text-gray-900 mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{story.description}</p>
              </div>
            </div>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-display font-bold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Story Info */}
              <div className="bg-surface rounded-xl p-6 paper-texture">
                <h3 className="font-display font-bold text-gray-900 mb-4">Story Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium capitalize">{story.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Chapters</span>
                    <span className="font-medium">{story.chapterCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Word Count</span>
                    <span className="font-medium">{story.wordCount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="font-medium">{format(new Date(story.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Updated</span>
                    <span className="font-medium">{format(new Date(story.updatedAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>

              {/* Chapter List */}
              <div className="bg-surface rounded-xl p-6 paper-texture">
                <h3 className="font-display font-bold text-gray-900 mb-4">Chapters</h3>
                
                {story.chapters && story.chapters.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {story.chapters.map((chapter) => (
                      <Link
                        key={chapter.Id}
                        to={`/story/${story.Id}/chapter/${chapter.Id}`}
                        className="block p-3 rounded-lg hover:bg-white transition-colors duration-200 border border-transparent hover:border-gray-100"
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Chapter {chapter.chapterNumber}: {chapter.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(chapter.publishDate), "MMM d")} • {chapter.views} views
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-3">
                            <span className="text-xs text-gray-400">{chapter.votes}</span>
                            <ApperIcon name="Heart" className="h-3 w-3 text-accent" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Empty
                    type="chapters"
                    title="No Chapters Yet"
                    description="This story hasn't been started yet. Check back soon!"
                    actionText="Browse Other Stories"
                    onAction={() => navigate("/")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoryDetail