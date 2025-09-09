import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import { formatCurrency, formatCompactDate } from "@/utils/formatters"

const TransactionItem = ({ 
  transaction,
  onEdit,
  onDelete,
  className,
  ...props 
}) => {
  const isIncome = transaction.type === "income"
  
  const getCategoryIcon = (category) => {
    const iconMap = {
      "Salary": "Briefcase",
      "Freelance": "Laptop",
      "Investment": "TrendingUp",
      "Groceries": "ShoppingCart",
      "Transportation": "Car",
      "Utilities": "Zap",
      "Entertainment": "Film",
      "Healthcare": "Heart",
      "Dining Out": "Coffee",
      "Shopping": "ShoppingBag",
      "Subscriptions": "Monitor",
      "Rent": "Home"
    }
    return iconMap[category] || "DollarSign"
  }
  
  return (
    <div 
      className={cn(
        "bg-white rounded-xl shadow-card p-4 hover:shadow-lg transition-all duration-200 border-l-4",
        {
          "border-l-success": isIncome,
          "border-l-error": !isIncome
        },
        className
      )} 
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={cn(
            "p-2 rounded-lg",
            {
              "bg-success/10": isIncome,
              "bg-error/10": !isIncome
            }
          )}>
            <ApperIcon 
              name={getCategoryIcon(transaction.category)} 
              className={cn(
                "w-5 h-5",
                {
                  "text-success": isIncome,
                  "text-error": !isIncome
                }
              )} 
            />
          </div>
          <div>
            <h4 className="font-medium text-secondary">
              {transaction.description || transaction.category}
            </h4>
            <p className="text-sm text-gray-600 flex items-center space-x-2">
              <span>{transaction.category}</span>
              <span>•</span>
              <span>{formatCompactDate(transaction.date)}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={cn(
            "text-lg font-semibold",
            {
              "text-success": isIncome,
              "text-error": !isIncome
            }
          )}>
            {isIncome ? "+" : "-"}{formatCurrency(Math.abs(transaction.amount))}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            {onEdit && (
              <button
                onClick={() => onEdit(transaction)}
                className="p-1 text-gray-400 hover:text-primary transition-colors"
              >
                <ApperIcon name="Edit" className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transaction.Id)}
                className="p-1 text-gray-400 hover:text-error transition-colors"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionItem