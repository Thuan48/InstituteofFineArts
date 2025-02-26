import { useState } from "react"
import HomeAppBar from "../HomeAppBar"
import Sidebar from "./ManagerSidebar"
import { Outlet } from "react-router-dom"
import '../../styles/admin.css';

const ManagerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="admin-layout">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex flex-col flex-1">
        <HomeAppBar toggleSidebar={toggleSidebar} />
        <main
          className={`admin-main ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
          style={{ marginTop: "64px" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ManagerLayout