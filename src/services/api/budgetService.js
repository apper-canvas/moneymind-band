import mockBudgets from "@/services/mockData/budgets.json"

let budgets = [...mockBudgets]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const budgetService = {
  async getAll() {
    await delay(300)
    return [...budgets]
  },

  async getById(id) {
    await delay(200)
    const budget = budgets.find(b => b.Id === parseInt(id))
    if (!budget) {
      throw new Error("Budget not found")
    }
    return { ...budget }
  },

  async create(budgetData) {
    await delay(400)
    const maxId = Math.max(...budgets.map(b => b.Id), 0)
    const newBudget = {
      Id: maxId + 1,
      ...budgetData,
      currentSpent: 0
    }
    budgets.push(newBudget)
    return { ...newBudget }
  },

  async update(id, updateData) {
    await delay(350)
    const index = budgets.findIndex(b => b.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Budget not found")
    }
    budgets[index] = { ...budgets[index], ...updateData }
    return { ...budgets[index] }
  },

  async delete(id) {
    await delay(250)
    const index = budgets.findIndex(b => b.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Budget not found")
    }
    const deleted = budgets.splice(index, 1)[0]
    return { ...deleted }
  },

  async getByMonth(month, year) {
    await delay(250)
    return budgets.filter(b => b.month === month && b.year === year)
  },

  async updateSpending(category, amount, month, year) {
    await delay(300)
    const monthKey = `${year}-${String(month).padStart(2, "0")}`
    const budget = budgets.find(b => b.category === category && b.month === monthKey)
    if (budget) {
      budget.currentSpent += amount
      return { ...budget }
    }
    return null
  }
}