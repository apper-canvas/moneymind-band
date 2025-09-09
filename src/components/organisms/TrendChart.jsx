import React, { useState, useEffect } from "react"
import Chart from "react-apexcharts"
import Card from "@/components/atoms/Card"
import Select from "@/components/atoms/Select"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { transactionService } from "@/services/api/transactionService"
import { formatCurrency } from "@/utils/formatters"

const TrendChart = ({ className, ...props }) => {
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
      setError("Failed to load trend data")
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

  if (transactions.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary">Spending Trends</h3>
          <Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </Select>
        </div>
        <Empty 
          icon="TrendingUp"
          title="No transaction data"
          description="Add some transactions to see your spending trends over time"
        />
      </Card>
    )
  }

  // Generate monthly data
  const months = parseInt(timeframe)
  const monthlyData = {}
  const now = new Date()

  // Initialize months
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const label = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    monthlyData[key] = {
      label,
      income: 0,
      expenses: 0
    }
  }

  // Aggregate transaction data
  transactions.forEach(transaction => {
    const date = new Date(transaction.date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    
    if (monthlyData[key]) {
      if (transaction.type === "income") {
        monthlyData[key].income += transaction.amount
      } else {
        monthlyData[key].expenses += transaction.amount
      }
    }
  })

  const chartData = Object.values(monthlyData)
  const categories = chartData.map(data => data.label)
  const incomeSeries = chartData.map(data => data.income)
  const expenseSeries = chartData.map(data => data.expenses)

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ["#10b981", "#ef4444"],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 5
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Inter, ui-sans-serif, system-ui"
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Inter, ui-sans-serif, system-ui"
        },
        formatter: function(val) {
          return formatCurrency(val)
        }
      }
    },
    legend: {
      fontSize: "14px",
      fontFamily: "Inter, ui-sans-serif, system-ui"
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
    markers: {
      size: 6,
      strokeWidth: 2,
      strokeColors: ["#10b981", "#ef4444"],
      hover: {
        size: 8
      }
    }
  }

  const series = [
    {
      name: "Income",
      data: incomeSeries
    },
    {
      name: "Expenses",
      data: expenseSeries
    }
  ]

  return (
    <Card className={className} {...props}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary">Spending Trends</h3>
          <Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </Select>
        </div>
        <Chart
          options={chartOptions}
          series={series}
          type="line"
          height={350}
        />
      </div>
    </Card>
  )
}

export default TrendChart