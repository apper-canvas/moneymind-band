import mockCategories from "@/services/mockData/categories.json"

let categories = [...mockCategories]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const categoryService = {
  async getAll() {
    await delay(200)
    return [...categories]
  },

  async getById(id) {
    await delay(150)
    const category = categories.find(c => c.Id === parseInt(id))
    if (!category) {
      throw new Error("Category not found")
    }
    return { ...category }
  },

  async getByType(type) {
    await delay(200)
    return categories.filter(c => c.type === type)
  },

  async create(categoryData) {
    await delay(300)
    const maxId = Math.max(...categories.map(c => c.Id), 0)
    const newCategory = {
      Id: maxId + 1,
      ...categoryData,
      isDefault: false
    }
    categories.push(newCategory)
    return { ...newCategory }
  },

  async update(id, updateData) {
    await delay(250)
    const index = categories.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Category not found")
    }
    categories[index] = { ...categories[index], ...updateData }
    return { ...categories[index] }
  },

  async delete(id) {
    await delay(200)
    const index = categories.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Category not found")
    }
    if (categories[index].isDefault) {
      throw new Error("Cannot delete default category")
    }
    const deleted = categories.splice(index, 1)[0]
    return { ...deleted }
  }
}