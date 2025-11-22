import usersData from "@/services/mockData/users.json"

class UserService {
  constructor() {
    this.users = [...usersData]
  }

  // Helper method to add delay for realistic loading
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get all users
  async getUsers() {
    await this.delay()
    return [...this.users]
  }

  // Get user by ID
  async getUserById(id) {
    await this.delay()
    
    const user = this.users.find(u => u.Id === parseInt(id))
    if (!user) {
      throw new Error("User not found")
    }
    
    return { ...user }
  }

  // Get user by username
  async getUserByUsername(username) {
    await this.delay()
    
    const user = this.users.find(u => u.username === username)
    if (!user) {
      throw new Error("User not found")
    }
    
    return { ...user }
  }

  // Get current user (mock implementation)
  async getCurrentUser() {
    await this.delay(200)
    
    // Return first user as "current user" for demo purposes
    return { ...this.users[0] }
  }

  // Follow author
  async followAuthor(userId, authorId) {
    await this.delay(200)
    
    const user = this.users.find(u => u.Id === parseInt(userId))
    const author = this.users.find(u => u.Id === parseInt(authorId))
    
    if (!user || !author) {
      throw new Error("User or author not found")
    }
    
    if (!user.followingAuthors.includes(authorId)) {
      user.followingAuthors.push(authorId)
      author.followersCount += 1
    }
    
    return { user: { ...user }, author: { ...author } }
  }

  // Unfollow author
  async unfollowAuthor(userId, authorId) {
    await this.delay(200)
    
    const user = this.users.find(u => u.Id === parseInt(userId))
    const author = this.users.find(u => u.Id === parseInt(authorId))
    
    if (!user || !author) {
      throw new Error("User or author not found")
    }
    
    const followIndex = user.followingAuthors.indexOf(authorId)
    if (followIndex > -1) {
      user.followingAuthors.splice(followIndex, 1)
      author.followersCount = Math.max(0, author.followersCount - 1)
    }
    
    return { user: { ...user }, author: { ...author } }
  }

  // Update user profile
  async updateUser(id, userData) {
    await this.delay(300)
    
    const userIndex = this.users.findIndex(u => u.Id === parseInt(id))
    if (userIndex === -1) {
      throw new Error("User not found")
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData
    }
    
    return { ...this.users[userIndex] }
  }

  // Search users
  async searchUsers(query) {
    await this.delay()
    
    if (!query || query.trim().length < 2) {
      return []
    }
    
    const searchTerm = query.toLowerCase()
    return this.users.filter(user =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.displayName.toLowerCase().includes(searchTerm) ||
      (user.bio && user.bio.toLowerCase().includes(searchTerm))
    )
  }

  // Get popular authors
  async getPopularAuthors(limit = 10) {
    await this.delay()
    
    return this.users
      .filter(user => user.isWriter)
      .sort((a, b) => b.followersCount - a.followersCount)
      .slice(0, limit)
  }
}

export default new UserService()