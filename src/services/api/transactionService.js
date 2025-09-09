import mockTransactions from "@/services/mockData/transactions.json"

let transactions = [...mockTransactions]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const transactionService = {
  async getAll() {
    await delay(300)
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  async getById(id) {
    await delay(200)
    const transaction = transactions.find(t => t.Id === parseInt(id))
    if (!transaction) {
      throw new Error("Transaction not found")
    }
    return { ...transaction }
  },

  async create(transactionData) {
    await delay(400)
    const maxId = Math.max(...transactions.map(t => t.Id), 0)
    const newTransaction = {
      Id: maxId + 1,
      ...transactionData,
      createdAt: new Date().toISOString(),
      date: transactionData.date || new Date().toISOString()
    }
    transactions.push(newTransaction)
    return { ...newTransaction }
  },

  async update(id, updateData) {
    await delay(350)
    const index = transactions.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Transaction not found")
    }
    transactions[index] = { ...transactions[index], ...updateData }
    return { ...transactions[index] }
  },

  async delete(id) {
    await delay(250)
    const index = transactions.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Transaction not found")
    }
    const deleted = transactions.splice(index, 1)[0]
    return { ...deleted }
  },

  async getByDateRange(startDate, endDate) {
    await delay(300)
    const start = new Date(startDate)
    const end = new Date(endDate)
    return transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= start && transactionDate <= end
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  async getByCategory(category) {
    await delay(250)
    return transactions.filter(t => t.category === category)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  async getByType(type) {
    await delay(250)
    return transactions.filter(t => t.type === type)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }
}