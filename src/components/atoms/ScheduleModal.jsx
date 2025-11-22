import React, { useState } from "react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"

function ScheduleModal({ isOpen, onClose, onSchedule, loading = false }) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0]
  
  // Get current time in HH:MM format
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time")
      return
    }

    // Combine date and time into a single Date object
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`)
    const now = new Date()

    // Validate that the scheduled time is in the future
    if (scheduledDateTime <= now) {
      toast.error("Scheduled time must be in the future")
      return
    }

    // Call the parent component's onSchedule function
    onSchedule(scheduledDateTime.toISOString())
  }

  const handleClose = () => {
    setSelectedDate("")
    setSelectedTime("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-gray-900">
            Schedule Chapter Release
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Choose when you want this chapter to be automatically published.
          </p>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Release Date
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="w-full"
              disabled={loading}
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Release Time
            </label>
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              min={selectedDate === today ? currentTime : undefined}
              className="w-full"
              disabled={loading}
            />
          </div>

          {/* Preview */}
          {selectedDate && selectedTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <ApperIcon name="Calendar" size={16} className="inline mr-2" />
                Chapter will be published on{" "}
                <span className="font-medium">
                  {format(new Date(`${selectedDate}T${selectedTime}`), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={loading || !selectedDate || !selectedTime}
            className="flex items-center space-x-2"
          >
            {loading && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
            <ApperIcon name="Calendar" size={16} />
            <span>Schedule Release</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ScheduleModal