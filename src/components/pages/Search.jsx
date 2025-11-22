import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import StoryGrid from "@/components/organisms/StoryGrid"
import FilterSidebar from "@/components/organisms/FilterSidebar"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import storyService from "@/services/api/storyService"

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSort, setSelectedSort] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)

  const query = searchParams.get("q") || ""

  const loadSearchResults = async () => {
    try {
      setLoading(true)
      setError("")

      const filters = {
        search: query,
        genres: selectedGenres,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        sortBy: selectedSort
      }

      const searchResults = await storyService.getStories(filters)
      setStories(searchResults)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      loadSearchResults()
    } else {
      setStories([])
    }
  }, [query, selectedGenres, selectedStatus, selectedSort])

  const handleSearch = (newQuery) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() })
    } else {
      setSearchParams({})
    }
  }

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
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-4">
            Search Stories
          </h1>
          
          {/* Search Bar */}
          <SearchBar 
            onSearch={handleSearch}
            className="max-w-2xl"
            placeholder="Search for stories, authors, or genres..."
          />
        </div>

        {/* Search Results Header */}
        {query && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900">
                Search Results for "{query}"
              </h2>
              <p className="text-gray-600 mt-1">
                {loading ? "Searching..." : `${stories.length} stories found`}
              </p>
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
        )}

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
            {!query ? (
              /* No search query */
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Search" className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
                  Start Your Search
                </h3>
                <p className="text-gray-600 mb-6">
                  Enter a search term to find stories, authors, or genres that interest you.
                </p>
                
                {/* Popular Search Suggestions */}
                <div className="max-w-md mx-auto">
                  <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "fantasy romance", "vampire", "enemies to lovers", 
                      "high school", "mystery", "science fiction"
                    ].map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : loading ? (
              <Loading />
            ) : error ? (
              <ErrorView message={error} onRetry={loadSearchResults} />
            ) : (
              <StoryGrid 
                stories={stories}
                emptyState={
                  <Empty
                    type="stories"
                    title="No stories found"
                    description={`We couldn't find any stories matching "${query}". Try different keywords or adjust your filters.`}
                    actionText="Browse All Stories"
                    onAction={() => window.location.href = "/"}
                  />
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search