import mockGoals from "@/services/mockData/goals.json"

let goals = [...mockGoals]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const goalService = {
  async getAll() {
    await delay(300)
    return [...goals].sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
  },

  async getById(id) {
    await delay(200)
    const goal = goals.find(g => g.Id === parseInt(id))
    if (!goal) {
      throw new Error("Goal not found")
    }
    return { ...goal }
  },

  async create(goalData) {
    await delay(400)
    const maxId = Math.max(...goals.map(g => g.Id), 0)
    const newGoal = {
      Id: maxId + 1,
      ...goalData,
      currentAmount: goalData.currentAmount || 0,
      createdAt: new Date().toISOString()
    }
    goals.push(newGoal)
    return { ...newGoal }
  },

  async update(id, updateData) {
    await delay(350)
    const index = goals.findIndex(g => g.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Goal not found")
    }
    goals[index] = { ...goals[index], ...updateData }
    return { ...goals[index] }
  },

  async delete(id) {
    await delay(250)
    const index = goals.findIndex(g => g.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Goal not found")
    }
    const deleted = goals.splice(index, 1)[0]
    return { ...deleted }
  },

  async addToGoal(id, amount) {
    await delay(300)
    const index = goals.findIndex(g => g.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Goal not found")
    }
    goals[index].currentAmount += amount
    return { ...goals[index] }
  }
}