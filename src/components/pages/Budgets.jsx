import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Card from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import BudgetItem from "@/components/molecules/BudgetItem"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { budgetService } from "@/services/api/budgetService"
import { categoryService } from "@/services/api/categoryService"
import { getCurrentMonth, getMonthKey } from "@/utils/formatters"

const Budgets = () => {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editBudget, setEditBudget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    monthlyLimit: "",
    month: getMonthKey(),
    year: new Date().getFullYear()
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setError("")
      setLoading(true)
      const [budgetData, categoryData] = await Promise.all([
        budgetService.getAll(),
        categoryService.getByType("expense")
      ])
      setBudgets(budgetData)
      setCategories(categoryData)
    } catch (err) {
      setError("Failed to load budgets")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.category || !formData.monthlyLimit) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      const budgetData = {
        ...formData,
        monthlyLimit: parseFloat(formData.monthlyLimit)
      }

      if (editBudget) {
        await budgetService.update(editBudget.Id, budgetData)
        toast.success("Budget updated successfully!")
      } else {
        await budgetService.create(budgetData)
        toast.success("Budget created successfully!")
      }
      
      setShowForm(false)
      setEditBudget(null)
      resetForm()
      loadData()
    } catch (err) {
      toast.error(err.message || "Failed to save budget")
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      category: "",
      monthlyLimit: "",
      month: getMonthKey(),
      year: new Date().getFullYear()
    })
  }

  const handleEdit = (budget) => {
    setEditBudget(budget)
    setFormData({
      category: budget.category,
      monthlyLimit: budget.monthlyLimit.toString(),
      month: budget.month,
      year: budget.year
    })
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditBudget(null)
    resetForm()
  }

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  const currentMonth = getCurrentMonth()
  const availableCategories = categories.filter(category => 
    !budgets.some(budget => 
      budget.category === category.name && 
      budget.month === getMonthKey()
    )
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Budget Management</h1>
          <p className="text-gray-600">Set and track your monthly spending limits for {currentMonth.month} {currentMonth.year}</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          disabled={availableCategories.length === 0}
          className="bg-gradient-to-r from-primary to-success"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {/* Budget Form */}
      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary">
              {editBudget ? "Edit Budget" : "Create New Budget"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelForm}
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Category" required>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={!!editBudget}
                >
                  <option value="">Select a category</option>
                  {(editBudget ? categories : availableCategories).map((category) => (
                    <option key={category.Id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Monthly Limit" required>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monthlyLimit}
                  onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                  placeholder="0.00"
                />
              </FormField>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? (
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ApperIcon name={editBudget ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                )}
                {editBudget ? "Update Budget" : "Create Budget"}
              </Button>
              
              {!editBudget && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}

      {/* Budget List */}
      <div>
        {budgets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card">
            <Empty 
              icon="PieChart"
              title="No budgets set"
              description="Create your first budget to start tracking your spending limits"
              actionLabel="Create Budget"
              onAction={() => setShowForm(true)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <BudgetItem
                key={budget.Id}
                budget={budget}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      {availableCategories.length === 0 && budgets.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-success/5 border border-primary/20">
          <div className="flex items-start space-x-3">
            <ApperIcon name="Info" className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-secondary mb-1">All Categories Budgeted</h3>
              <p className="text-sm text-gray-600">
                You've created budgets for all available expense categories. 
                You can edit existing budgets or wait for the next month to create new ones.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Budgets