import React from "react"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { formatCurrency } from "@/utils/formatters"

const StatCard = ({ 
  title,
  value,
  icon,
  trend,
  trendValue,
  className,
  ...props 
}) => {
  const isPositiveTrend = trend === "up"
  const isNegativeTrend = trend === "down"
  
  return (
    <Card className={cn("p-6 hover:shadow-lg transition-all duration-200", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
          <ApperIcon name={icon} className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center space-x-1 text-sm",
            {
              "text-success": isPositiveTrend,
              "text-error": isNegativeTrend,
              "text-gray-500": !isPositiveTrend && !isNegativeTrend
            }
          )}>
            <ApperIcon 
              name={isPositiveTrend ? "TrendingUp" : isNegativeTrend ? "TrendingDown" : "Minus"} 
              className="w-4 h-4" 
            />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-secondary bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          {typeof value === "number" ? formatCurrency(value) : value}
        </h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </Card>
  )
}

export default StatCard