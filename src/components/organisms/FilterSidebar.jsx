import React from "react"
import ApperIcon from "@/components/ApperIcon"
import GenreFilter from "@/components/molecules/GenreFilter"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const FilterSidebar = ({
  selectedGenres = [],
  selectedStatus = "all",
  selectedSort = "popular",
  onGenreToggle,
  onStatusChange,
  onSortChange,
  onClearFilters,
  className
}) => {
  const statusOptions = [
    { value: "all", label: "All Stories" },
    { value: "ongoing", label: "Ongoing" },
    { value: "complete", label: "Complete" }
  ]

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "recent", label: "Recently Updated" },
    { value: "newest", label: "Newest First" },
    { value: "views", label: "Most Viewed" }
  ]

  const hasActiveFilters = 
    selectedGenres.length > 0 || 
    selectedStatus !== "all" || 
    selectedSort !== "popular"

  return (
    <div className={cn("space-y-6", className)}>
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-gray-900">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-primary"
          >
            <ApperIcon name="X" className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      )}

      {/* Genre Filter */}
      <GenreFilter
        selectedGenres={selectedGenres}
        onGenreToggle={onGenreToggle}
      />

      {/* Status Filter */}
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-gray-900">Status</h3>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange?.(option.value)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                selectedStatus === option.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-gray-900">Sort By</h3>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange?.(option.value)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between",
                selectedSort === option.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <span>{option.label}</span>
              {selectedSort === option.value && (
                <ApperIcon name="Check" className="h-3 w-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-gray-900">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "enemies-to-lovers", "slow-burn", "mystery", "magic",
            "high-school", "supernatural", "vampire", "dragons"
          ].map((tag) => (
            <button
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar