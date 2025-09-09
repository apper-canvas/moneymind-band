import React from "react"
import { cn } from "@/utils/cn"

const Loading = ({ className, type = "cards", ...props }) => {
  if (type === "cards") {
    return (
      <div className={cn("space-y-6", className)} {...props}>
        {/* Overview Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-card p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-3">
                <div className="w-24 h-8 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Chart Areas Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-card p-6 animate-pulse">
            <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
            <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="bg-white rounded-xl shadow-card p-6 animate-pulse">
            <div className="w-28 h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === "list") {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-card p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="w-20 h-4 bg-gray-200 rounded ml-auto"></div>
                <div className="w-12 h-3 bg-gray-200 rounded ml-auto"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Default spinner
  return (
    <div className={cn("flex items-center justify-center p-8", className)} {...props}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

export default Loading