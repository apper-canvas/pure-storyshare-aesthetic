import React from "react"
import { cn } from "@/utils/cn"
import Badge from "@/components/atoms/Badge"

const GenreFilter = ({ 
  genres, 
  selectedGenres = [], 
  onGenreToggle, 
  className 
}) => {
  const availableGenres = [
    "Romance", "Fantasy", "Mystery", "Teen Fiction", 
    "Science Fiction", "Horror", "Action", "Drama"
  ]

  const handleGenreClick = (genre) => {
    if (onGenreToggle) {
      onGenreToggle(genre)
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-display font-semibold text-gray-900">Genres</h3>
      <div className="flex flex-wrap gap-2">
        {availableGenres.map((genre) => {
          const isSelected = selectedGenres.includes(genre)
          return (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full transition-all duration-200",
                "border border-gray-200 hover:border-primary/50",
                isSelected
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 hover:bg-primary/5"
              )}
            >
              {genre}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default GenreFilter