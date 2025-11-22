import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { format } from "date-fns"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import StoryGrid from "@/components/organisms/StoryGrid"
import userService from "@/services/api/userService"
import storyService from "@/services/api/storyService"

const Profile = () => {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("stories")
  const [isFollowing, setIsFollowing] = useState(false)

  const loadProfile = async () => {
    if (!username) return
    
    try {
      setLoading(true)
      setError("")
      
      const [userData, userStories] = await Promise.all([
        userService.getUserByUsername(username),
        storyService.getStoriesByAuthor(username)
      ])
      
      setUser(userData)
      setStories(userStories)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [username])

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await userService.unfollowAuthor("user1", user.Id) // Current user follows/unfollows
      } else {
        await userService.followAuthor("user1", user.Id)
      }
      setIsFollowing(!isFollowing)
      
      // Update follower count
      setUser(prev => ({
        ...prev,
        followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      }))
    } catch (err) {
      console.error("Failed to follow/unfollow user:", err)
    }
  }

  const getTotalStats = () => {
    return stories.reduce(
      (acc, story) => ({
        totalVotes: acc.totalVotes + story.totalVotes,
        totalViews: acc.totalViews + story.totalViews,
        totalWords: acc.totalWords + story.wordCount
      }),
      { totalVotes: 0, totalViews: 0, totalWords: 0 }
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
    return <ErrorView message={error} onRetry={loadProfile} />
  }

  if (!user) {
    return <ErrorView message="User not found" />
  }

  const totalStats = getTotalStats()
  const isCurrentUser = username === "current-user" || username === "user1"

  const tabs = [
    { 
      key: "stories", 
      label: "Published Stories", 
      icon: "BookOpen",
      count: stories.filter(s => s.chapterCount > 0).length
    },
    { 
      key: "reading", 
      label: "Reading List", 
      icon: "Bookmark",
      count: 0 // Mock data
    },
    { 
      key: "following", 
      label: "Following", 
      icon: "Users",
      count: user.followingAuthors?.length || 0
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-surface rounded-xl p-6 sm:p-8 paper-texture mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1">
                    {user.displayName}
                  </h1>
                  <p className="text-gray-500 mb-3">@{user.username}</p>
                  {user.bio && (
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {user.bio}
                    </p>
                  )}
                </div>

                {/* Actions */}
                {!isCurrentUser && (
                  <div className="flex items-center space-x-3">
                    <Button
                      variant={isFollowing ? "primary" : "secondary"}
                      onClick={handleFollow}
                      className="flex items-center space-x-2"
                    >
                      <ApperIcon name="UserPlus" className="h-4 w-4" />
                      <span>{isFollowing ? "Following" : "Follow"}</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <ApperIcon name="MessageCircle" className="h-4 w-4" />
                      <span>Message</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* User Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-500 mt-4">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900">{stories.length}</span>
                  <span>stories</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900">{user.followersCount}</span>
                  <span>followers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900">{user.followingAuthors?.length || 0}</span>
                  <span>following</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>Joined</span>
                  <span className="font-semibold text-gray-900">
                    {format(new Date(user.createdAt), "MMM yyyy")}
                  </span>
                </div>
              </div>

              {/* Writer Badge */}
              {user.isWriter && (
                <div className="mt-3">
                  <Badge variant="primary" className="flex items-center space-x-1 w-fit">
                    <ApperIcon name="PenTool" className="h-3 w-3" />
                    <span>Writer</span>
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Writer Stats (for writers only) */}
        {user.isWriter && stories.length > 0 && (
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
                <ApperIcon name="FileText" className="h-5 w-5 text-purple-500" />
                <span className="text-xs text-gray-500">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatNumber(totalStats.totalWords)}
              </div>
              <div className="text-xs text-gray-500">Words</div>
            </div>

            <div className="bg-surface rounded-xl p-6 paper-texture">
              <div className="flex items-center justify-between mb-2">
                <ApperIcon name="BookOpen" className="h-5 w-5 text-green-500" />
                <span className="text-xs text-gray-500">Complete</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stories.filter(s => s.status === "complete").length}
              </div>
              <div className="text-xs text-gray-500">Stories</div>
            </div>
          </div>
        )}

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

        {/* Content */}
        <div className="min-h-[400px]">
          {activeTab === "stories" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Published Stories
                </h2>
                <div className="text-sm text-gray-500">
                  {stories.filter(s => s.chapterCount > 0).length} stories
                </div>
              </div>
              
              <StoryGrid 
                stories={stories.filter(s => s.chapterCount > 0)}
                emptyState={
                  <Empty
                    type="stories"
                    title={isCurrentUser ? "You haven't published any stories yet" : "No published stories"}
                    description={
                      isCurrentUser 
                        ? "Start writing your first story to share with readers"
                        : "This author hasn't published any stories yet"
                    }
                    actionText={isCurrentUser ? "Start Writing" : "Browse Stories"}
                    onAction={() => window.location.href = isCurrentUser ? "/write" : "/"}
                  />
                }
              />
            </div>
          )}

          {activeTab === "reading" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Reading List
                </h2>
                <div className="text-sm text-gray-500">
                  0 stories
                </div>
              </div>
              
              <Empty
                type="reading"
                title={isCurrentUser ? "Your reading list is empty" : "Reading list is private"}
                description={
                  isCurrentUser 
                    ? "Discover amazing stories and add them to your reading list"
                    : "This user's reading list is not public"
                }
                actionText="Browse Stories"
                onAction={() => window.location.href = "/"}
              />
            </div>
          )}

          {activeTab === "following" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Following Authors
                </h2>
                <div className="text-sm text-gray-500">
                  {user.followingAuthors?.length || 0} authors
                </div>
              </div>
              
              <Empty
                type="following"
                title="Not following anyone yet"
                description="Follow your favorite authors to get notified when they publish new stories"
                actionText="Discover Authors"
                onAction={() => window.location.href = "/"}
                icon="Users"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile