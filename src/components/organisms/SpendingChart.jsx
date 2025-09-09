import React, { useState, useEffect } from "react"
import Chart from "react-apexcharts"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { transactionService } from "@/services/api/transactionService"
import { formatCurrency } from "@/utils/formatters"

const SpendingChart = ({ className, ...props }) => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
      setError("Failed to load spending data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <Loading />
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <Error message={error} onRetry={loadTransactions} />
      </Card>
    )
  }

  const expenseTransactions = transactions.filter(t => t.type === "expense")

  if (expenseTransactions.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4">Spending by Category</h3>
        <Empty 
          icon="PieChart"
          title="No expenses found"
          description="Start tracking your expenses to see your spending patterns"
        />
      </Card>
    )
  }

  // Group expenses by category
  const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
    return acc
  }, {})

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount
  })).sort((a, b) => b.amount - a.amount)

  const chartOptions = {
    chart: {
      type: "pie",
      height: 350,
      toolbar: {
        show: false
      }
    },
    labels: chartData.map(item => item.category),
    colors: ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#c6f6d5", "#d1fae5"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontFamily: "Inter, ui-sans-serif, system-ui",
      offsetY: 10
    },
    plotOptions: {
      pie: {
        donut: {
          size: "30%"
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        return Math.round(val) + "%"
      },
      style: {
        fontSize: "12px",
        fontFamily: "Inter, ui-sans-serif, system-ui",
        fontWeight: 600
      }
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Inter, ui-sans-serif, system-ui"
      },
      y: {
        formatter: function(val) {
          return formatCurrency(val)
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 300
        },
        legend: {
          position: "bottom"
        }
      }
    }]
  }

  const series = chartData.map(item => item.amount)

  return (
    <Card className={className} {...props}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4">Spending by Category</h3>
        <Chart
          options={chartOptions}
          series={series}
          type="pie"
          height={350}
        />
      </div>
    </Card>
  )
}

export default SpendingChart