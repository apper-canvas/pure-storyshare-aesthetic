import React, { useState, useEffect } from "react"
import StoryGrid from "@/components/organisms/StoryGrid"
import FilterSidebar from "@/components/organisms/FilterSidebar"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import storyService from "@/services/api/storyService"

const Browse = () => {
  const [stories, setStories] = useState([])
  const [trendingStories, setTrendingStories] = useState([])
  const [recentStories, setRecentStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSort, setSelectedSort] = useState("popular")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentView, setCurrentView] = useState("all") // "all", "trending", "recent"
  const [showFilters, setShowFilters] = useState(false)

  const loadStories = async () => {
    try {
      setLoading(true)
      setError("")

      const filters = {
        genres: selectedGenres,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        sortBy: selectedSort,
        search: searchQuery
      }

      const [allStories, trending, recent] = await Promise.all([
        storyService.getStories(filters),
        storyService.getTrendingStories(6),
        storyService.getRecentlyUpdated(6)
      ])

      setStories(allStories)
      setTrendingStories(trending)
      setRecentStories(recent)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStories()
  }, [selectedGenres, selectedStatus, selectedSort, searchQuery])

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleStatusChange = (status) => {
    setSelectedStatus(status)
  }

  const handleSortChange = (sort) => {
    setSelectedSort(sort)
  }

  const handleClearFilters = () => {
    setSelectedGenres([])
    setSelectedStatus("all")
    setSelectedSort("popular")
    setSearchQuery("")
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentView("all")
  }

  const getCurrentStories = () => {
    switch (currentView) {
      case "trending":
        return trendingStories
      case "recent":
        return recentStories
      default:
        return stories
    }
  }

  const getViewTitle = () => {
    switch (currentView) {
      case "trending":
        return "Trending Stories"
      case "recent":
        return "Recently Updated"
      default:
        if (searchQuery) {
          return `Search Results for "${searchQuery}"`
        }
        return "Discover Stories"
    }
  }

  if (loading && stories.length === 0) {
    return <Loading />
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadStories} />
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Discover Amazing Stories
              </h1>
              <p className="text-gray-600">
                Explore thousands of serialized fiction stories from talented writers around the world
              </p>
            </div>
            <div className="flex-shrink-0">
              <SearchBar 
                onSearch={handleSearch}
                className="w-full lg:w-96"
              />
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: "all", label: "All Stories", icon: "BookOpen" },
              { key: "trending", label: "Trending", icon: "TrendingUp" },
              { key: "recent", label: "Recent", icon: "Clock" }
            ].map((view) => (
              <button
                key={view.key}
                onClick={() => setCurrentView(view.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentView === view.key
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ApperIcon name={view.icon} className="h-4 w-4" />
                <span>{view.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Filter Toggle */}
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2"
          >
            <ApperIcon name="Filter" className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                selectedGenres={selectedGenres}
                selectedStatus={selectedStatus}
                selectedSort={selectedSort}
                onGenreToggle={handleGenreToggle}
                onStatusChange={handleStatusChange}
                onSortChange={handleSortChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-display font-bold">Filters</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ApperIcon name="X" className="h-5 w-5" />
                    </button>
                  </div>
                  <FilterSidebar
                    selectedGenres={selectedGenres}
                    selectedStatus={selectedStatus}
                    selectedSort={selectedSort}
                    onGenreToggle={handleGenreToggle}
                    onStatusChange={handleStatusChange}
                    onSortChange={handleSortChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-gray-900">
                {getViewTitle()}
              </h2>
              <div className="text-sm text-gray-500">
                {getCurrentStories().length} stories
              </div>
            </div>

            <StoryGrid 
              stories={getCurrentStories()}
              loading={loading}
              emptyState={
                <Empty
                  type="stories"
                  title={searchQuery ? "No stories found" : "No stories available"}
                  description={
                    searchQuery 
                      ? `We couldn't find any stories matching "${searchQuery}". Try adjusting your search or filters.`
                      : "Check back soon for new stories, or be the first to write one!"
                  }
                  actionText="Start Writing"
                  onAction={() => window.location.href = "/write"}
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Browse