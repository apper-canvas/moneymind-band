import React from "react"
import { NavLink } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const MobileSidebar = ({ isOpen, onClose, className, ...props }) => {
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
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 lg:hidden",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen
          },
          className
        )} 
        {...props}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
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
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
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
    </>
  )
}

export default MobileSidebar