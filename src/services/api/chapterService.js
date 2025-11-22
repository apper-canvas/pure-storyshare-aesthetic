import chaptersData from "@/services/mockData/chapters.json"
import storiesData from "@/services/mockData/stories.json"
import commentsData from "@/services/mockData/comments.json"

class ChapterService {
  constructor() {
    this.chapters = [...chaptersData]
    this.stories = [...storiesData]
    this.comments = [...commentsData]
  }

  // Helper method to add delay for realistic loading
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get chapter by ID
  async getChapterById(id) {
    await this.delay()
    
    const chapter = this.chapters.find(c => c.Id === parseInt(id))
    if (!chapter) {
      throw new Error("Chapter not found")
    }
    
    // Get associated story
    const story = this.stories.find(s => s.Id === parseInt(chapter.storyId))
    
    // Get chapter comments
    const chapterComments = this.comments.filter(comment => comment.chapterId === id)
    
    return {
      ...chapter,
      story,
      comments: chapterComments
    }
  }

  // Get chapters by story ID
  async getChaptersByStoryId(storyId) {
    await this.delay()
    
    return this.chapters
      .filter(chapter => chapter.storyId === storyId)
      .sort((a, b) => a.chapterNumber - b.chapterNumber)
  }

  // Get next chapter
  async getNextChapter(currentChapterId) {
    await this.delay(200)
    
    const currentChapter = this.chapters.find(c => c.Id === parseInt(currentChapterId))
    if (!currentChapter) {
      return null
    }
    
    return this.chapters.find(chapter => 
      chapter.storyId === currentChapter.storyId && 
      chapter.chapterNumber === currentChapter.chapterNumber + 1
    )
  }

  // Get previous chapter
  async getPreviousChapter(currentChapterId) {
    await this.delay(200)
    
    const currentChapter = this.chapters.find(c => c.Id === parseInt(currentChapterId))
    if (!currentChapter) {
      return null
    }
    
    return this.chapters.find(chapter => 
      chapter.storyId === currentChapter.storyId && 
      chapter.chapterNumber === currentChapter.chapterNumber - 1
    )
  }

  // Vote for chapter
  async voteForChapter(chapterId) {
    await this.delay(200)
    
    const chapter = this.chapters.find(c => c.Id === parseInt(chapterId))
    if (chapter) {
      chapter.votes += 1
      
      // Also update story total votes
      const story = this.stories.find(s => s.Id === parseInt(chapter.storyId))
      if (story) {
        story.totalVotes += 1
      }
    }
    
    return chapter
  }

  // Add view to chapter
  async addView(chapterId) {
    await this.delay(100)
    
    const chapter = this.chapters.find(c => c.Id === parseInt(chapterId))
    if (chapter) {
      chapter.views += 1
      
      // Also update story total views
      const story = this.stories.find(s => s.Id === parseInt(chapter.storyId))
      if (story) {
        story.totalViews += 1
      }
    }
    
    return chapter
  }

  // Create new chapter
async createChapter(chapterData) {
    await this.delay(500)
    
    const newChapter = {
      Id: Math.max(...this.chapters.map(c => c.Id)) + 1,
      ...chapterData,
      views: 0,
      votes: 0,
      commentCount: 0,
      wordCount: this.countWords(chapterData.content || ""),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Include scheduled publish time if provided
    if (chapterData.scheduledPublishAt) {
      newChapter.scheduledPublishAt = chapterData.scheduledPublishAt
    }
    
    this.chapters.push(newChapter)
    
    // Update story chapter count and word count
    const story = this.stories.find(s => s.Id === parseInt(chapterData.storyId))
    if (story) {
      story.chapterCount += 1
      story.wordCount += newChapter.wordCount
      story.updatedAt = new Date().toISOString()
    }
    
    return newChapter
  }

  // Update chapter
  async updateChapter(id, chapterData) {
    await this.delay(300)
    
    const chapterIndex = this.chapters.findIndex(c => c.Id === parseInt(id))
    if (chapterIndex === -1) {
      throw new Error("Chapter not found")
    }
    
    const oldWordCount = this.chapters[chapterIndex].wordCount
    const newWordCount = this.countWords(chapterData.content || this.chapters[chapterIndex].content)
    
    this.chapters[chapterIndex] = {
      ...this.chapters[chapterIndex],
      ...chapterData,
      wordCount: newWordCount,
      updatedAt: new Date().toISOString()
    }
    
    // Update story word count
    const story = this.stories.find(s => s.Id === parseInt(this.chapters[chapterIndex].storyId))
    if (story) {
      story.wordCount = story.wordCount - oldWordCount + newWordCount
      story.updatedAt = new Date().toISOString()
    }
    
    return this.chapters[chapterIndex]
  }

  // Delete chapter
  async deleteChapter(id) {
    await this.delay(300)
    
    const chapterIndex = this.chapters.findIndex(c => c.Id === parseInt(id))
    if (chapterIndex === -1) {
      throw new Error("Chapter not found")
    }
    
    const chapter = this.chapters[chapterIndex]
    
    // Update story counts
    const story = this.stories.find(s => s.Id === parseInt(chapter.storyId))
    if (story) {
      story.chapterCount -= 1
      story.wordCount -= chapter.wordCount
      story.updatedAt = new Date().toISOString()
    }
    
    this.chapters.splice(chapterIndex, 1)
    
    // Remove associated comments
    this.comments = this.comments.filter(comment => comment.chapterId !== id)
    
    return true
  }

  // Helper method to count words
  countWords(text) {
    if (!text) return 0
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }
}

export default new ChapterService()