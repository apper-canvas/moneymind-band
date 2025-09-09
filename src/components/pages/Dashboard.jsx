import React, { useState, useEffect } from "react"
import StatCard from "@/components/molecules/StatCard"
import SpendingChart from "@/components/organisms/SpendingChart"
import TrendChart from "@/components/organisms/TrendChart"
import TransactionItem from "@/components/molecules/TransactionItem"
import GoalItem from "@/components/molecules/GoalItem"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { transactionService } from "@/services/api/transactionService"
import { budgetService } from "@/services/api/budgetService"
import { goalService } from "@/services/api/goalService"
import { formatCurrency, getCurrentMonth, getMonthKey } from "@/utils/formatters"

const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setError("")
      setLoading(true)
      const [transactionData, budgetData, goalData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
        goalService.getAll()
      ])
      setTransactions(transactionData)
      setBudgets(budgetData)
      setGoals(goalData)
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

  // Calculate statistics
  const currentMonth = getCurrentMonth()
  const monthKey = getMonthKey()
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionMonth = getMonthKey(new Date(t.date))
    return transactionMonth === monthKey
  })

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0)
  const budgetUsed = budgets.reduce((sum, b) => sum + b.currentSpent, 0)
  const budgetRemaining = totalBudget - budgetUsed

  const totalGoalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalGoalProgress = goals.reduce((sum, g) => sum + g.currentAmount, 0)

  const recentTransactions = transactions.slice(0, 5)
  const activeGoals = goals.filter(g => (g.currentAmount / g.targetAmount) < 1).slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-2">
          Welcome back! 
        </h1>
        <p className="text-gray-600">
          Here's your financial overview for {currentMonth.month} {currentMonth.year}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current Balance"
          value={balance}
          icon="Wallet"
          trend={balance > 0 ? "up" : balance < 0 ? "down" : "neutral"}
          trendValue={balance > 0 ? "+$" + Math.abs(balance).toFixed(0) : balance < 0 ? "-$" + Math.abs(balance).toFixed(0) : "$0"}
        />
        <StatCard
          title="Monthly Income"
          value={totalIncome}
          icon="ArrowUp"
          trend="up"
          trendValue={`+${formatCurrency(totalIncome)}`}
        />
        <StatCard
          title="Monthly Expenses"
          value={totalExpenses}
          icon="ArrowDown"
          trend="down"
          trendValue={`-${formatCurrency(totalExpenses)}`}
        />
        <StatCard
          title="Budget Remaining"
          value={budgetRemaining}
          icon="PieChart"
          trend={budgetRemaining > 0 ? "up" : "down"}
          trendValue={`${Math.round((budgetRemaining / totalBudget) * 100)}%`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />
        <TrendChart />
      </div>

      {/* Recent Activity & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary flex items-center">
              <ApperIcon name="Clock" className="w-5 h-5 mr-2 text-primary" />
              Recent Transactions
            </h3>
          </div>
          
          {recentTransactions.length === 0 ? (
            <Empty 
              icon="Receipt"
              title="No transactions yet"
              description="Start by adding your first transaction"
            />
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <TransactionItem 
                  key={transaction.Id}
                  transaction={transaction}
                />
              ))}
            </div>
          )}
        </div>

        {/* Active Goals */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary flex items-center">
              <ApperIcon name="Target" className="w-5 h-5 mr-2 text-primary" />
              Active Goals
            </h3>
          </div>
          
          {activeGoals.length === 0 ? (
            <Empty 
              icon="Target"
              title="No active goals"
              description="Set your first savings goal to get started"
            />
          ) : (
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <GoalItem 
                  key={goal.Id}
                  goal={goal}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard