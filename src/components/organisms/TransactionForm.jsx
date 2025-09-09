import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { categoryService } from "@/services/api/categoryService"
import { transactionService } from "@/services/api/transactionService"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"

const TransactionForm = ({ onSuccess, editTransaction, onCancel }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0]
  })

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        type: editTransaction.type,
        amount: editTransaction.amount.toString(),
        category: editTransaction.category,
        description: editTransaction.description || "",
        date: new Date(editTransaction.date).toISOString().split("T")[0]
      })
    }
  }, [editTransaction])

  const loadCategories = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err) {
      setError("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.amount || !formData.category) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      }

      if (editTransaction) {
        await transactionService.update(editTransaction.Id, transactionData)
        toast.success("Transaction updated successfully!")
      } else {
        await transactionService.create(transactionData)
        toast.success("Transaction added successfully!")
      }
      
      onSuccess?.()
    } catch (err) {
      toast.error(err.message || "Failed to save transaction")
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0]
    })
  }

  if (loading) {
    return <Loading className="py-8" />
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadCategories}
      />
    )
  }

  const filteredCategories = categories.filter(c => c.type === formData.type)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-secondary">
          {editTransaction ? "Edit Transaction" : "Add New Transaction"}
        </h2>
        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Type" required>
            <Select
              value={formData.type}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  type: e.target.value,
                  category: "" // Reset category when type changes
                })
              }}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
          </FormField>

          <FormField label="Amount" required>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Category" required>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select a category</option>
              {filteredCategories.map((category) => (
                <option key={category.Id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Date" required>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="Description">
          <Input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Optional description"
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
              <ApperIcon name={editTransaction ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
            )}
            {editTransaction ? "Update Transaction" : "Add Transaction"}
          </Button>
          
          {!editTransaction && (
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
  )
}

export default TransactionForm