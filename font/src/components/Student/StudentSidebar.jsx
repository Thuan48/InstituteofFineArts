import { Award, Home, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import '../../styles/admin.css'

const StudentSidebar = () => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <aside className="admin-sidebar">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <nav className="space-y-2">
        <Link
          to="/student/dashboard"
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${isActive("/student/dashboard") ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/competition"
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${isActive("/competition") ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
        >
          <Award size={20} />
          <span>Competitions</span>
        </Link>
        <Link
          to="/student/exhibition"
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${isActive("/student/exhibition") ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
        >
          <Award size={20} />
          <span>Exhibitions</span>
        </Link>
      </nav>
    </aside>
  );
};

export default StudentSidebar

