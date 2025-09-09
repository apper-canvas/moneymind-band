export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export const formatPercentage = (value, total) => {
  if (total === 0) return "0%"
  return Math.round((value / total) * 100) + "%"
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export const formatCompactDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export const getCurrentMonth = () => {
  const now = new Date()
  return {
    month: now.toLocaleString("default", { month: "long" }),
    year: now.getFullYear(),
  }
}

export const getMonthKey = (date = new Date()) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}