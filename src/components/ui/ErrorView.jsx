import React from "react"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ onRetry, message = "Something went wrong. Please try again." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-red-100 p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-error to-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertTriangle" className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
            Oops! Story Interrupted
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <ApperIcon name="RefreshCw" className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          )}
          
          <button
            onClick={() => window.location.href = "/"}
            className="w-full btn-ghost"
          >
            Return to Browse
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Still having trouble? Check your connection or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ErrorView