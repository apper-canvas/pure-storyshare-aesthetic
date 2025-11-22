import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Badge from "@/components/atoms/Badge"
import storyService from "@/services/api/storyService"

const EditStory = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    genres: [],
    tags: [],
    status: "ongoing",
    mature: false
  })

  const availableGenres = [
    "Romance", "Fantasy", "Mystery", "Teen Fiction",
    "Science Fiction", "Horror", "Action", "Drama"
  ]

  const loadStory = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError("")
      const storyData = await storyService.getStoryById(id)
      setStory(storyData)
      setFormData({
        title: storyData.title,
        description: storyData.description,
        coverImage: storyData.coverImage || "",
        genres: storyData.genres || [],
        tags: storyData.tags || [],
        status: storyData.status,
        mature: storyData.mature || false
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStory()
  }, [id])

  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenreToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const tag = e.target.value.trim().toLowerCase()
      if (!formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }))
      }
      e.target.value = ""
    }
  }

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a story title")
      return false
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a story description")
      return false
    }
    if (formData.genres.length === 0) {
      toast.error("Please select at least one genre")
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      await storyService.updateStory(id, formData)
      toast.success("Story updated successfully!")
      navigate(`/story/${id}`)
    } catch (err) {
      toast.error("Failed to update story")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      return
    }

    try {
      setSaving(true)
      await storyService.deleteStory(id)
      toast.success("Story deleted successfully!")
      navigate("/dashboard")
    } catch (err) {
      toast.error("Failed to delete story")
      console.error(err)
      setSaving(false)
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/story/${id}`)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4" />
            <span>Back to Story</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              Edit Story
            </h1>
            <p className="text-gray-600">
              Update your story details and settings
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-surface rounded-xl p-6 sm:p-8 paper-texture">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleFormDataChange("title", e.target.value)}
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
                value={formData.description}
                onChange={(e) => handleFormDataChange("description", e.target.value)}
                placeholder="Write a compelling description that will attract readers..."
                rows={4}
                className="flex w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <Input
                type="url"
                value={formData.coverImage}
                onChange={(e) => handleFormDataChange("coverImage", e.target.value)}
                placeholder="https://example.com/cover-image.jpg"
              />
              {formData.coverImage && (
                <div className="mt-3">
                  <img
                    src={formData.coverImage}
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
                    disabled={!formData.genres.includes(genre) && formData.genres.length >= 3}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.genres.includes(genre)
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
                {formData.tags.map((tag) => (
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

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Status
              </label>
              <div className="flex items-center space-x-4">
                {["ongoing", "complete"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleFormDataChange("status", status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.status === status
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "ongoing" ? "Ongoing" : "Complete"}
                  </button>
                ))}
              </div>
            </div>

            {/* Mature Content */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="mature"
                checked={formData.mature}
                onChange={(e) => handleFormDataChange("mature", e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="mature" className="text-sm text-gray-700">
                This story contains mature content (18+ only)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="error"
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
              <span>Delete Story</span>
            </Button>

            <div className="flex space-x-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate(`/story/${id}`)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2"
              >
                {saving && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
                <span>Save Changes</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditStory