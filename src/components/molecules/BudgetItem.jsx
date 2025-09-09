import React from "react"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { formatCurrency, formatPercentage } from "@/utils/formatters"

const getAlertLevel = (percentage) => {
  if (percentage >= 100) {
    return {
      type: 'critical',
      colorClasses: 'bg-error text-white',
      icon: 'AlertCircle',
      message: 'Budget exceeded!'
    }
  } else if (percentage >= 80) {
    return {
      type: 'warning', 
      colorClasses: 'bg-warning text-white',
      icon: 'AlertTriangle',
      message: 'Approaching limit'
    }
  }
  return null
}

const BudgetItem = ({ 
  budget,
  onEdit,
  className,
  ...props 
}) => {
const percentage = (budget.currentSpent / budget.monthlyLimit) * 100
  const remaining = budget.monthlyLimit - budget.currentSpent
  const isOverBudget = percentage > 100
  const alert = getAlertLevel(percentage)
  const getCategoryIcon = (category) => {
    const iconMap = {
      "Groceries": "ShoppingCart",
      "Transportation": "Car",
      "Entertainment": "Film",
      "Dining Out": "Coffee",
      "Shopping": "ShoppingBag",
      "Healthcare": "Heart",
      "Subscriptions": "Monitor"
    }
    return iconMap[category] || "DollarSign"
  }
  
  return (
    <Card 
      className={cn(
        "p-6 hover:shadow-lg transition-all duration-200",
        {
          "border-l-4 border-l-error": isOverBudget,
          "border-l-4 border-l-warning": percentage > 80 && !isOverBudget,
          "border-l-4 border-l-success": percentage <= 80
        },
        className
      )} 
      {...props}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ApperIcon 
              name={getCategoryIcon(budget.category)} 
              className="w-5 h-5 text-primary" 
            />
          </div>
          <div>
            <h3 className="font-semibold text-secondary">{budget.category}</h3>
            <p className="text-sm text-gray-600">
              {formatCurrency(budget.currentSpent)} of {formatCurrency(budget.monthlyLimit)}
            </p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={() => onEdit(budget)}
            className="p-1 text-gray-400 hover:text-primary transition-colors"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </button>
        )}
{alert && (
          <div className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            alert.colorClasses
          )}>
            <ApperIcon name={alert.icon} size={12} />
            {alert.message}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Progress</span>
          <span className={cn(
            "text-sm font-medium",
            {
              "text-error": isOverBudget,
              "text-warning": percentage > 80 && !isOverBudget,
              "text-success": percentage <= 80
            }
          )}>
            {formatPercentage(budget.currentSpent, budget.monthlyLimit)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              {
                "bg-error": isOverBudget,
                "bg-warning": percentage > 80 && !isOverBudget,
                "bg-gradient-to-r from-primary to-success": percentage <= 80
              }
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Remaining</span>
          <span className={cn(
            "font-medium",
            {
              "text-error": remaining < 0,
              "text-success": remaining >= 0
            }
          )}>
            {formatCurrency(Math.abs(remaining))} {remaining < 0 ? "over" : "left"}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default BudgetItem