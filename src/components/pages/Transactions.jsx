import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Input from "@/components/atoms/Input"
import TransactionForm from "@/components/organisms/TransactionForm"
import TransactionItem from "@/components/molecules/TransactionItem"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { transactionService } from "@/services/api/transactionService"
import { categoryService } from "@/services/api/categoryService"

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editTransaction, setEditTransaction] = useState(null)
  
  // Filters
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setError("")
      setLoading(true)
      const [transactionData, categoryData] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll()
      ])
      setTransactions(transactionData)
      setCategories(categoryData)
    } catch (err) {
      setError("Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditTransaction(null)
    loadData()
  }

  const handleEdit = (transaction) => {
    setEditTransaction(transaction)
    setShowForm(true)
  }

  const handleDelete = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return
    }

    try {
      await transactionService.delete(transactionId)
      toast.success("Transaction deleted successfully!")
      loadData()
    } catch (err) {
      toast.error("Failed to delete transaction")
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditTransaction(null)
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    const matchesSearch = !searchQuery || 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesType && matchesCategory && matchesSearch
  })

  if (loading) {
    return <Loading type="list" />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Transactions</h1>
          <p className="text-gray-600">Track and manage your income and expenses</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-primary to-success"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <TransactionForm
          onSuccess={handleFormSuccess}
          editTransaction={editTransaction}
          onCancel={handleCancelForm}
        />
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Type
            </label>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Category
            </label>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.Id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div>
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card">
            <Empty 
              icon="Receipt"
              title={transactions.length === 0 ? "No transactions yet" : "No matching transactions"}
              description={transactions.length === 0 
                ? "Add your first transaction to get started tracking your finances" 
                : "Try adjusting your filters or search criteria"
              }
              actionLabel={transactions.length === 0 ? "Add Transaction" : undefined}
              onAction={transactions.length === 0 ? () => setShowForm(true) : undefined}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.Id}
                transaction={transaction}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions