import { Home, Users, Trophy } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import '../../styles/admin.css'

const ManagerSidebar = () => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <aside className="admin-sidebar">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <nav className="space-y-2">
        <Link
          to="/manager/dashboard"
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${isActive("/manager/dashboard") ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/manager/competitions"
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${isActive("/manager/competitions") ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
        >
          <Trophy size={20} />
          <span>Competitions</span>
        </Link>
        <Link
          to="/manager/exhibition"
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${isActive("/manager/competitions") ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
        >
          <Trophy size={20} />
          <span>Exhibition</span>
        </Link>
      </nav>
    </aside>
  )
}

export default ManagerSidebar

