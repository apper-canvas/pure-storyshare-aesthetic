import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ChapterNavigation from "@/components/organisms/ChapterNavigation"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import chapterService from "@/services/api/chapterService"

const ReadChapter = () => {
  const { id: storyId, chapterId } = useParams()
  const navigate = useNavigate()
  const [chapter, setChapter] = useState(null)
  const [previousChapter, setPreviousChapter] = useState(null)
  const [nextChapter, setNextChapter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isVoted, setIsVoted] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  const loadChapter = async () => {
    if (!chapterId) return
    
    try {
      setLoading(true)
      setError("")
      
      const [chapterData, prevChapter, nextChap] = await Promise.all([
        chapterService.getChapterById(chapterId),
        chapterService.getPreviousChapter(chapterId),
        chapterService.getNextChapter(chapterId)
      ])
      
      setChapter(chapterData)
      setPreviousChapter(prevChapter)
      setNextChapter(nextChap)
      
      // Track view
      await chapterService.addView(chapterId)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChapter()
  }, [chapterId])

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const viewHeight = window.innerHeight
      const totalHeight = document.documentElement.scrollHeight - viewHeight
      const progress = Math.min(100, (scrolled / totalHeight) * 100)
      setReadingProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleVote = async () => {
    if (!chapter) return
    
    try {
      await chapterService.voteForChapter(chapter.Id)
      setIsVoted(true)
      setChapter(prev => ({
        ...prev,
        votes: prev.votes + 1
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

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadChapter} />
  }

  if (!chapter) {
    return <ErrorView message="Chapter not found" />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(`/story/${storyId}`)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Story</span>
            </Button>
            
            <div className="text-center">
              <h1 className="font-display font-bold text-lg text-gray-900">
                Chapter {chapter.chapterNumber}
              </h1>
              <p className="text-sm text-gray-500">{chapter.story?.title}</p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={isVoted ? "accent" : "ghost"}
                size="sm"
                onClick={handleVote}
                className="flex items-center space-x-1"
              >
                <ApperIcon name="Heart" className={`h-4 w-4 ${isVoted ? "fill-current" : ""}`} />
                <span className="hidden sm:inline">{chapter.votes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.print()}
                className="flex items-center space-x-1"
              >
                <ApperIcon name="Printer" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Chapter Header */}
          <header className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
              {chapter.title}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>Chapter {chapter.chapterNumber}</span>
              <span>•</span>
              <span>{chapter.wordCount} words</span>
              <span>•</span>
              <span>{chapter.views} views</span>
            </div>
          </header>

          {/* Chapter Content */}
          <div className="reading-content prose prose-lg max-w-none">
            {chapter.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-6 leading-relaxed text-gray-800">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Chapter Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-100">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Eye" className="h-4 w-4" />
                  <span>{chapter.views} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Heart" className="h-4 w-4" />
                  <span>{chapter.votes} votes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="MessageCircle" className="h-4 w-4" />
                  <span>{chapter.commentCount} comments</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant={isVoted ? "accent" : "primary"}
                  onClick={handleVote}
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="Heart" className={`h-4 w-4 ${isVoted ? "fill-current" : ""}`} />
                  <span>{isVoted ? "Voted" : "Vote"}</span>
                </Button>
                
                <Button
                  variant={isBookmarked ? "primary" : "secondary"}
                  onClick={handleBookmark}
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="Bookmark" className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                  <span>{isBookmarked ? "Saved" : "Save"}</span>
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </article>

      {/* Navigation */}
      <ChapterNavigation
        story={chapter.story}
        currentChapter={chapter}
        previousChapter={previousChapter}
        nextChapter={nextChapter}
        onVote={handleVote}
        onBookmark={handleBookmark}
        isVoted={isVoted}
        isBookmarked={isBookmarked}
      />
    </div>
  )
}

export default ReadChapter