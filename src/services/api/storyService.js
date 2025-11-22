import storiesData from "@/services/mockData/stories.json"
import chaptersData from "@/services/mockData/chapters.json"
import usersData from "@/services/mockData/users.json"

class StoryService {
  constructor() {
    this.stories = [...storiesData]
    this.chapters = [...chaptersData]
    this.users = [...usersData]
  }

  // Helper method to add delay for realistic loading
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get all stories with optional filtering
  async getStories(filters = {}) {
    await this.delay()
    
    let filteredStories = [...this.stories]
    
    // Filter by genre
    if (filters.genres && filters.genres.length > 0) {
      filteredStories = filteredStories.filter(story => 
        story.genres.some(genre => filters.genres.includes(genre))
      )
    }
    
    // Filter by status
    if (filters.status) {
      filteredStories = filteredStories.filter(story => story.status === filters.status)
    }
    
    // Filter by search query
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredStories = filteredStories.filter(story =>
        story.title.toLowerCase().includes(searchLower) ||
        story.description.toLowerCase().includes(searchLower) ||
        story.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    
    // Sort stories
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "popular":
          filteredStories.sort((a, b) => b.totalVotes - a.totalVotes)
          break
        case "recent":
          filteredStories.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          break
        case "views":
          filteredStories.sort((a, b) => b.totalViews - a.totalViews)
          break
        case "newest":
          filteredStories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        default:
          break
      }
    }
    
    // Add author information
    return filteredStories.map(story => ({
      ...story,
      author: this.users.find(user => user.username === story.authorId)
    }))
  }

  // Get trending stories
  async getTrendingStories(limit = 6) {
    await this.delay()
    
    return this.stories
      .sort((a, b) => {
        // Sort by a combination of recent activity and popularity
        const aScore = a.totalVotes + (a.totalViews / 10) + (a.totalComments * 5)
        const bScore = b.totalVotes + (b.totalViews / 10) + (b.totalComments * 5)
        return bScore - aScore
      })
      .slice(0, limit)
      .map(story => ({
        ...story,
        author: this.users.find(user => user.username === story.authorId)
      }))
  }

  // Get recently updated stories
  async getRecentlyUpdated(limit = 6) {
    await this.delay()
    
    return this.stories
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit)
      .map(story => ({
        ...story,
        author: this.users.find(user => user.username === story.authorId)
      }))
  }

  // Get story by ID
  async getStoryById(id) {
    await this.delay()
    
    const story = this.stories.find(s => s.Id === parseInt(id))
    if (!story) {
      throw new Error("Story not found")
    }
    
    const author = this.users.find(user => user.username === story.authorId)
    const storyChapters = this.chapters
      .filter(chapter => chapter.storyId === id)
      .sort((a, b) => a.chapterNumber - b.chapterNumber)
    
    return {
      ...story,
      author,
      chapters: storyChapters
    }
  }

  // Get stories by author
  async getStoriesByAuthor(authorId) {
    await this.delay()
    
    return this.stories
      .filter(story => story.authorId === authorId)
      .map(story => ({
        ...story,
        author: this.users.find(user => user.username === story.authorId)
      }))
  }

  // Vote for a story
  async voteForStory(storyId) {
    await this.delay(200)
    
    const story = this.stories.find(s => s.Id === parseInt(storyId))
    if (story) {
      story.totalVotes += 1
    }
    
    return story
  }

  // Create new story
  async createStory(storyData) {
    await this.delay(500)
    
    const newStory = {
      Id: Math.max(...this.stories.map(s => s.Id)) + 1,
      ...storyData,
      totalVotes: 0,
      totalViews: 0,
      totalComments: 0,
      chapterCount: 0,
      wordCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.stories.push(newStory)
    return newStory
  }

  // Update story
  async updateStory(id, storyData) {
    await this.delay(300)
    
    const storyIndex = this.stories.findIndex(s => s.Id === parseInt(id))
    if (storyIndex === -1) {
      throw new Error("Story not found")
    }
    
    this.stories[storyIndex] = {
      ...this.stories[storyIndex],
      ...storyData,
      updatedAt: new Date().toISOString()
    }
    
    return this.stories[storyIndex]
  }

  // Delete story
  async deleteStory(id) {
    await this.delay(300)
    
    const storyIndex = this.stories.findIndex(s => s.Id === parseInt(id))
    if (storyIndex === -1) {
      throw new Error("Story not found")
    }
    
    this.stories.splice(storyIndex, 1)
    
    // Also remove associated chapters
    this.chapters = this.chapters.filter(chapter => chapter.storyId !== id)
    
    return true
  }

  // Get available genres
  getGenres() {
    const allGenres = this.stories.flatMap(story => story.genres)
    return [...new Set(allGenres)].sort()
  }
}

export default new StoryService()