import React, { useState, useEffect } from "react"
import Select from "@/components/atoms/Select"
import Card from "@/components/atoms/Card"
import StatCard from "@/components/molecules/StatCard"
import SpendingChart from "@/components/organisms/SpendingChart"
import TrendChart from "@/components/organisms/TrendChart"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { transactionService } from "@/services/api/transactionService"
import { formatCurrency } from "@/utils/formatters"

const Reports = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeframe, setTimeframe] = useState("6") // months
  
  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await transactionService.getAll()
      setTransactions(data)
    } catch (err) {
      setError("Failed to load reports data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error message={error} onRetry={loadTransactions} />
  }

  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Financial Reports</h1>
          <p className="text-gray-600">Analyze your spending patterns and financial trends</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card">
          <Empty 
            icon="BarChart"
            title="No data to analyze"
            description="Add some transactions to see your financial reports and insights"
          />
        </div>
      </div>
    )
  }

  // Filter transactions by timeframe
  const months = parseInt(timeframe)
  const cutoffDate = new Date()
  cutoffDate.setMonth(cutoffDate.getMonth() - months)
  
  const filteredTransactions = transactions.filter(t => 
    new Date(t.date) >= cutoffDate
  )

  // Calculate statistics
  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const netIncome = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  // Category breakdown
  const expensesByCategory = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const topCategories = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  // Monthly averages
  const monthlyIncome = totalIncome / months
  const monthlyExpenses = totalExpenses / months

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Financial Reports</h1>
          <p className="text-gray-600">Analyze your spending patterns and financial trends</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-secondary">Time Period:</label>
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-32"
          >
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={totalIncome}
          icon="ArrowUp"
          trend="up"
          trendValue={`${months}M Average: ${formatCurrency(monthlyIncome)}`}
        />
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          icon="ArrowDown"
          trend="down"
          trendValue={`${months}M Average: ${formatCurrency(monthlyExpenses)}`}
        />
        <StatCard
          title="Net Income"
          value={netIncome}
          icon="TrendingUp"
          trend={netIncome > 0 ? "up" : "down"}
          trendValue={`${Math.abs(savingsRate).toFixed(1)}% Savings Rate`}
        />
        <StatCard
          title="Transaction Count"
          value={filteredTransactions.length}
          icon="Receipt"
          trend="neutral"
          trendValue={`${(filteredTransactions.length / months).toFixed(0)} per month`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />
        <TrendChart />
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Spending Categories */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
            <ApperIcon name="BarChart" className="w-5 h-5 mr-2 text-primary" />
            Top Spending Categories
          </h3>
          
          {topCategories.length === 0 ? (
            <Empty 
              icon="PieChart"
              title="No expense data"
              description="Add some expenses to see your top spending categories"
            />
          ) : (
            <div className="space-y-4">
              {topCategories.map(([category, amount], index) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-secondary">{category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-secondary">
                      {formatCurrency(amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {((amount / totalExpenses) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Financial Health Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
            <ApperIcon name="Heart" className="w-5 h-5 mr-2 text-primary" />
            Financial Health
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-secondary">Savings Rate</span>
                <span className="text-sm font-semibold text-primary">
                  {savingsRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-primary to-success"
                  style={{ width: `${Math.max(0, Math.min(savingsRate, 100))}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {savingsRate >= 20 ? "Excellent!" : savingsRate >= 10 ? "Good" : "Could improve"}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Monthly Income</span>
                <span className="font-medium text-success">
                  {formatCurrency(monthlyIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Monthly Expenses</span>
                <span className="font-medium text-error">
                  {formatCurrency(monthlyExpenses)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium text-secondary">Monthly Net</span>
                <span className={`font-semibold ${netIncome >= 0 ? "text-success" : "text-error"}`}>
                  {formatCurrency(netIncome / months)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Reports