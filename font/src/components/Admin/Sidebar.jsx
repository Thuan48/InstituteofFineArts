import { Home, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import '../../styles/admin.css'

const Sidebar = () => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <aside className="admin-sidebar">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <nav className="space-y-2">
        <Link
          to="/admin/dashboard"
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${isActive("/admin/dashboard") ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/admin/users"
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${isActive("/admin/users") ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
        >
          <Users size={20} />
          <span>Users</span>
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar

