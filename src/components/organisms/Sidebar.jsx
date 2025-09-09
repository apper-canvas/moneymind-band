import React from "react"
import { NavLink } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Sidebar = ({ className, ...props }) => {
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard"
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: "Receipt"
    },
    {
      name: "Budgets",
      href: "/budgets",
      icon: "PieChart"
    },
    {
      name: "Goals",
      href: "/goals",
      icon: "Target"
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "TrendingUp"
    }
  ]

  return (
    <aside 
      className={cn(
        "bg-white shadow-lg border-r border-gray-100 h-full",
        className
      )} 
      {...props}
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-success rounded-xl flex items-center justify-center">
            <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              MoneyMind
            </h1>
            <p className="text-xs text-gray-500">Personal Finance</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200",
                  {
                    "bg-gradient-to-r from-primary/10 to-success/10 text-primary border border-primary/20": isActive,
                    "text-gray-600 hover:bg-gray-50 hover:text-primary": !isActive
                  }
                )
              }
            >
              <ApperIcon name={item.icon} className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar