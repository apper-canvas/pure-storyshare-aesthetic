import React from "react"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="BookX" className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-6xl font-display font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            The story you're looking for seems to have wandered off into another dimension. 
            Let's get you back to discovering amazing tales.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full flex items-center justify-center space-x-2">
              <ApperIcon name="Home" className="h-4 w-4" />
              <span>Back to Browse</span>
            </Button>
          </Link>
          
          <Link to="/search">
            <Button variant="secondary" className="w-full flex items-center justify-center space-x-2">
              <ApperIcon name="Search" className="h-4 w-4" />
              <span>Search Stories</span>
            </Button>
          </Link>

          <Link to="/write">
            <Button variant="ghost" className="w-full flex items-center justify-center space-x-2">
              <ApperIcon name="PenTool" className="h-4 w-4" />
              <span>Write Your Story</span>
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Book" className="h-4 w-4" />
              <span>Discover</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Heart" className="h-4 w-4" />
              <span>Enjoy</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Share2" className="h-4 w-4" />
              <span>Share</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Lost in the stories? That's exactly where you should be.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound