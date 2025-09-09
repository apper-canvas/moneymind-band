import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Card from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import GoalItem from "@/components/molecules/GoalItem"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { goalService } from "@/services/api/goalService"

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [editGoal, setEditGoal] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [addAmount, setAddAmount] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    priority: "medium"
  })

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await goalService.getAll()
      setGoals(data)
    } catch (err) {
      setError("Failed to load goals")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.targetAmount || !formData.targetDate) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        targetDate: new Date(formData.targetDate).toISOString()
      }

      if (editGoal) {
        await goalService.update(editGoal.Id, goalData)
        toast.success("Goal updated successfully!")
      } else {
        await goalService.create(goalData)
        toast.success("Goal created successfully!")
      }
      
      setShowForm(false)
      setEditGoal(null)
      resetForm()
      loadGoals()
    } catch (err) {
      toast.error(err.message || "Failed to save goal")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddMoney = async (e) => {
    e.preventDefault()
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    try {
      setSubmitting(true)
      await goalService.addToGoal(selectedGoal.Id, parseFloat(addAmount))
      toast.success("Money added to goal successfully!")
      setShowAddMoney(false)
      setSelectedGoal(null)
      setAddAmount("")
      loadGoals()
    } catch (err) {
      toast.error(err.message || "Failed to add money to goal")
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      targetAmount: "",
      currentAmount: "",
      targetDate: "",
      priority: "medium"
    })
  }

  const handleEdit = (goal) => {
    setEditGoal(goal)
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: new Date(goal.targetDate).toISOString().split("T")[0],
      priority: goal.priority
    })
    setShowForm(true)
  }

  const handleAddMoneyToGoal = (goal) => {
    setSelectedGoal(goal)
    setShowAddMoney(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditGoal(null)
    resetForm()
  }

  const handleCancelAddMoney = () => {
    setShowAddMoney(false)
    setSelectedGoal(null)
    setAddAmount("")
  }

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error message={error} onRetry={loadGoals} />
  }

  const completedGoals = goals.filter(g => (g.currentAmount / g.targetAmount) >= 1)
  const activeGoals = goals.filter(g => (g.currentAmount / g.targetAmount) < 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Savings Goals</h1>
          <p className="text-gray-600">Track your progress toward financial milestones</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-primary to-success"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Goal Form */}
      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary">
              {editGoal ? "Edit Goal" : "Create New Goal"}
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
              <FormField label="Goal Title" required>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Emergency Fund, Vacation, etc."
                />
              </FormField>

              <FormField label="Target Amount" required>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="0.00"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Current Amount">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  placeholder="0.00"
                />
              </FormField>

              <FormField label="Target Date" required>
                <Input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                />
              </FormField>
            </div>

            <FormField label="Priority">
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </FormField>

            <div className="flex items-center space-x-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? (
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ApperIcon name={editGoal ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                )}
                {editGoal ? "Update Goal" : "Create Goal"}
              </Button>
              
              {!editGoal && (
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

      {/* Add Money Form */}
      {showAddMoney && selectedGoal && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary">
              Add Money to "{selectedGoal.title}"
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelAddMoney}
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleAddMoney} className="space-y-6">
            <FormField label="Amount to Add" required>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="0.00"
                autoFocus
              />
            </FormField>

            <div className="flex items-center space-x-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? (
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                )}
                Add Money
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelAddMoney}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-secondary mb-4">Active Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGoals.map((goal) => (
              <GoalItem
                key={goal.Id}
                goal={goal}
                onEdit={handleEdit}
                onAddMoney={handleAddMoneyToGoal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center">
            <ApperIcon name="CheckCircle" className="w-5 h-5 mr-2 text-success" />
            Completed Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedGoals.map((goal) => (
              <GoalItem
                key={goal.Id}
                goal={goal}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="bg-white rounded-xl shadow-card">
          <Empty 
            icon="Target"
            title="No savings goals yet"
            description="Start by setting your first savings goal to work towards your financial dreams"
            actionLabel="Create Goal"
            onAction={() => setShowForm(true)}
          />
        </div>
      )}
    </div>
  )
}

export default Goals