import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import storyService from "@/services/api/storyService"
import { cn } from "@/utils/cn"

const TrendingCarousel = ({ className }) => {
  const [stories, setStories] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    const loadTrendingStories = async () => {
      try {
        setLoading(true)
        const trendingStories = await storyService.getTrendingStories(5)
        setStories(trendingStories)
      } catch (error) {
        console.error("Failed to load trending stories:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTrendingStories()
  }, [])

  // Auto-rotation effect
  useEffect(() => {
    if (!autoPlay || stories.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % stories.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [autoPlay, stories.length])

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % stories.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + stories.length) % stories.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 10000)
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
    return (
      <div className={cn("relative h-80 lg:h-96 bg-gray-100 rounded-2xl overflow-hidden animate-pulse", className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Loading trending stories...</div>
        </div>
      </div>
    )
  }

  if (stories.length === 0) {
    return null
  }

  return (
    <div className={cn("relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg", className)}>
      {/* Slides */}
      <div className="relative h-full">
        {stories.map((story, index) => (
          <div
            key={story.Id}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out transform",
              index === currentSlide 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            )}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${story.coverImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex items-center">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  {/* Trending Badge */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="warning" className="flex items-center space-x-1">
                      <ApperIcon name="TrendingUp" className="h-3 w-3" />
                      <span>Trending</span>
                    </Badge>
                    <Badge 
                      variant={story.status === "complete" ? "success" : "info"}
                      className="text-xs"
                    >
                      {story.status === "complete" ? "Complete" : "Ongoing"}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-3 line-clamp-2">
                    {story.title}
                  </h2>

                  {/* Author */}
                  <div className="flex items-center text-gray-200 mb-4">
                    <ApperIcon name="User" className="h-4 w-4 mr-2" />
                    <span className="text-lg">{story.author?.displayName}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-lg leading-relaxed mb-6 line-clamp-3">
                    {story.description}
                  </p>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {story.genres.slice(0, 3).map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-sm bg-white/20 text-white border-white/30">
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-white/90 mb-8">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Heart" className="h-5 w-5 text-accent" />
                      <span className="font-medium">{formatNumber(story.totalVotes)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Eye" className="h-5 w-5" />
                      <span className="font-medium">{formatNumber(story.totalViews)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="BookOpen" className="h-5 w-5" />
                      <span className="font-medium">{story.chapterCount} chapters</span>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="flex items-center space-x-4">
                    <Link to={`/story/${story.Id}`}>
                      <Button size="lg" className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white">
                        <ApperIcon name="BookOpen" className="h-5 w-5" />
                        <span>Read Story</span>
                      </Button>
                    </Link>
                    <Link to={`/story/${story.Id}`}>
                      <Button variant="ghost" size="lg" className="text-white border-white/30 hover:bg-white/10">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {stories.length > 1 && (
        <>
          {/* Previous/Next Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all duration-200 group"
          >
            <ApperIcon name="ChevronLeft" className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all duration-200 group"
          >
            <ApperIcon name="ChevronRight" className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                )}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all duration-200"
            >
              <ApperIcon name={autoPlay ? "Pause" : "Play"} className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default TrendingCarousel