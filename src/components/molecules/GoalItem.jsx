import React from "react"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { formatCurrency, formatDate, formatPercentage } from "@/utils/formatters"

const GoalItem = ({ 
  goal,
  onEdit,
  onAddMoney,
  className,
  ...props 
}) => {
  const percentage = (goal.currentAmount / goal.targetAmount) * 100
  const remaining = goal.targetAmount - goal.currentAmount
  const isCompleted = percentage >= 100
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-error bg-error/10"
      case "medium": return "text-warning bg-warning/10"
      case "low": return "text-info bg-info/10"
      default: return "text-gray-500 bg-gray-100"
    }
  }
  
  return (
    <Card 
      className={cn(
        "p-6 hover:shadow-lg transition-all duration-200",
        {
          "border-l-4 border-l-success": isCompleted,
          "border-l-4 border-l-primary": !isCompleted
        },
        className
      )} 
      {...props}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-secondary">{goal.title}</h3>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getPriorityColor(goal.priority)
            )}>
              {goal.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            Target: {formatCurrency(goal.targetAmount)} by {formatDate(goal.targetDate)}
          </p>
        </div>
        {onEdit && (
          <button
            onClick={() => onEdit(goal)}
            className="p-1 text-gray-400 hover:text-primary transition-colors"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-primary">
            {formatPercentage(goal.currentAmount, goal.targetAmount)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="h-3 rounded-full bg-gradient-to-r from-primary to-success transition-all duration-300"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-600">Current: </span>
            <span className="font-medium text-secondary">
              {formatCurrency(goal.currentAmount)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Remaining: </span>
            <span className="font-medium text-primary">
              {formatCurrency(Math.max(remaining, 0))}
            </span>
          </div>
        </div>
        
        {!isCompleted && onAddMoney && (
          <Button 
            onClick={() => onAddMoney(goal)}
            size="sm"
            className="w-full mt-4 bg-gradient-to-r from-primary to-success"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Money
          </Button>
        )}
        
        {isCompleted && (
          <div className="flex items-center justify-center space-x-2 mt-4 text-success">
            <ApperIcon name="CheckCircle" className="w-5 h-5" />
            <span className="font-medium">Goal Completed!</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default GoalItem