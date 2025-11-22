import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const navItems = [
    { label: "Browse", href: "/", icon: "BookOpen" },
    { label: "Write", href: "/write", icon: "PenTool" },
    { label: "Dashboard", href: "/dashboard", icon: "BarChart3" },
    { label: "Profile", href: "/profile/current-user", icon: "User" },
  ]

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-gradient group-hover:scale-105 transition-transform duration-200">
              StoryShare
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href === "/" && location.pathname === "/") ||
                (item.href !== "/" && location.pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  )}
                >
                  <ApperIcon name={item.icon} className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:block flex-1 max-w-md mx-8">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Search stories, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Link
              to="/search"
              className="lg:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <ApperIcon name="Search" className="h-5 w-5" />
            </Link>

            {/* Write Button */}
            <Link
              to="/write"
              className="hidden sm:flex btn-primary items-center space-x-2"
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
              <span>Write</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href === "/" && location.pathname === "/") ||
                  (item.href !== "/" && location.pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    )}
                  >
                    <ApperIcon name={item.icon} className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Write Button */}
            <div className="pt-4 border-t border-gray-100 mt-4">
              <Link
                to="/write"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full btn-primary"
              >
                <ApperIcon name="Plus" className="h-4 w-4" />
                <span>Start Writing</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header