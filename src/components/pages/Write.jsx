import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Badge from "@/components/atoms/Badge"
import storyService from "@/services/api/storyService"
import chapterService from "@/services/api/chapterService"

const Write = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Story details, 2: First chapter
  const [loading, setLoading] = useState(false)

  // Story data
  const [storyData, setStoryData] = useState({
    title: "",
    description: "",
    coverImage: "",
    genres: [],
    tags: [],
    status: "ongoing",
    mature: false,
    authorId: "user1" // Current user
  })

  // Chapter data
  const [chapterData, setChapterData] = useState({
    title: "",
    content: "",
    status: "draft"
  })

  const availableGenres = [
    "Romance", "Fantasy", "Mystery", "Teen Fiction",
    "Science Fiction", "Horror", "Action", "Drama"
  ]

  const handleStoryDataChange = (field, value) => {
    setStoryData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenreToggle = (genre) => {
    setStoryData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const tag = e.target.value.trim().toLowerCase()
      if (!storyData.tags.includes(tag)) {
        setStoryData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }))
      }
      e.target.value = ""
    }
  }

  const handleTagRemove = (tagToRemove) => {
    setStoryData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleChapterChange = (field, value) => {
    setChapterData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateStoryData = () => {
    if (!storyData.title.trim()) {
      toast.error("Please enter a story title")
      return false
    }
    if (!storyData.description.trim()) {
      toast.error("Please enter a story description")
      return false
    }
    if (storyData.genres.length === 0) {
      toast.error("Please select at least one genre")
      return false
    }
    return true
  }

  const validateChapterData = () => {
    if (!chapterData.title.trim()) {
      toast.error("Please enter a chapter title")
      return false
    }
    if (!chapterData.content.trim()) {
      toast.error("Please write some content for your chapter")
      return false
    }
    return true
  }

  const handleNextStep = () => {
    if (validateStoryData()) {
      setStep(2)
    }
  }

  const handlePublish = async () => {
    if (!validateStoryData() || !validateChapterData()) {
      return
    }

    try {
      setLoading(true)

      // Create the story first
      const newStory = await storyService.createStory(storyData)
      
      // Then create the first chapter
      await chapterService.createChapter({
        ...chapterData,
        storyId: newStory.Id.toString(),
        chapterNumber: 1,
        status: "published"
      })

      toast.success("Story published successfully!")
      navigate(`/story/${newStory.Id}`)
    } catch (err) {
      toast.error("Failed to publish story")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!validateStoryData()) {
      return
    }

    try {
      setLoading(true)

      // Create the story first
      const newStory = await storyService.createStory(storyData)
      
      // Save chapter as draft if there's content
      if (chapterData.title.trim() || chapterData.content.trim()) {
        await chapterService.createChapter({
          ...chapterData,
          storyId: newStory.Id.toString(),
          chapterNumber: 1,
          status: "draft"
        })
      }

      toast.success("Story saved as draft!")
      navigate("/dashboard")
    } catch (err) {
      toast.error("Failed to save draft")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => step === 1 ? navigate(-1) : setStep(1)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
                {step === 1 ? "Create New Story" : "Write First Chapter"}
              </h1>
              <p className="text-gray-600">
                {step === 1 
                  ? "Tell us about your story and set the stage for your readers"
                  : "Write the opening chapter that will hook your readers"
                }
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
              }`}>
                1
              </div>
              <span className="text-sm font-medium text-gray-600">Story Details</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200">
              <div className={`h-full transition-all duration-300 ${
                step >= 2 ? "bg-primary" : "bg-gray-200"
              }`} style={{ width: step >= 2 ? "100%" : "0%" }} />
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
              }`}>
                2
              </div>
              <span className="text-sm font-medium text-gray-600">First Chapter</span>
            </div>
          </div>
        </div>

        {/* Step 1: Story Details */}
        {step === 1 && (
          <div className="bg-surface rounded-xl p-6 sm:p-8 paper-texture">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title *
                </label>
                <Input
                  type="text"
                  value={storyData.title}
                  onChange={(e) => handleStoryDataChange("title", e.target.value)}
                  placeholder="Enter your story title"
                  className="text-lg"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={storyData.description}
                  onChange={(e) => handleStoryDataChange("description", e.target.value)}
                  placeholder="Write a compelling description that will attract readers..."
                  rows={4}
                  className="flex w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {storyData.description.length}/500 characters
                </p>
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <Input
                  type="url"
                  value={storyData.coverImage}
                  onChange={(e) => handleStoryDataChange("coverImage", e.target.value)}
                  placeholder="https://example.com/cover-image.jpg"
                />
                {storyData.coverImage && (
                  <div className="mt-3">
                    <img
                      src={storyData.coverImage}
                      alt="Cover preview"
                      className="w-32 h-48 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = "none"
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Genres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genres * (Select up to 3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      disabled={!storyData.genres.includes(genre) && storyData.genres.length >= 3}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        storyData.genres.includes(genre)
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <Input
                  type="text"
                  onKeyDown={handleTagAdd}
                  placeholder="Add tags (press Enter to add)"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {storyData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>#{tag}</span>
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <ApperIcon name="X" className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Mature Content */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="mature"
                  checked={storyData.mature}
                  onChange={(e) => handleStoryDataChange("mature", e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="mature" className="text-sm text-gray-700">
                  This story contains mature content (18+ only)
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
              <Button onClick={handleNextStep}>
                Next: Write Chapter
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: First Chapter */}
        {step === 2 && (
          <div className="bg-surface rounded-xl p-6 sm:p-8 paper-texture">
            <div className="space-y-6">
              {/* Chapter Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter Title *
                </label>
                <Input
                  type="text"
                  value={chapterData.title}
                  onChange={(e) => handleChapterChange("title", e.target.value)}
                  placeholder="Chapter 1: ..."
                />
              </div>

              {/* Chapter Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter Content *
                </label>
                <textarea
                  value={chapterData.content}
                  onChange={(e) => handleChapterChange("content", e.target.value)}
                  placeholder="Start writing your first chapter here..."
                  rows={20}
                  className="flex w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none font-reading leading-relaxed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Word count: {chapterData.content.trim().split(/\s+/).filter(word => word.length > 0).length}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back to Story Details
              </Button>
              
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  onClick={handleSaveDraft}
                  disabled={loading}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  {loading && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
                  <span>Publish Story</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Write