import { useState } from "react"
import HomeAppBar from "../HomeAppBar"
import Sidebar from "./StudentSidebar"
import { Outlet } from "react-router-dom"
import '../../styles/admin.css';

const StudentLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="admin-layout flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <HomeAppBar toggleSidebar={toggleSidebar} />
        <main
          className={`admin-main ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
          style={{ marginTop: "64px" }}
        >
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default StudentLayout