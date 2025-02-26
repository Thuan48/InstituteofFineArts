import { useEffect, useState } from "react" // added useState
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers, fetchCurrentUser } from "../../Redux/User/Action"
import { getToken } from "../../utils/tokenManager"
import { useNavigate } from "react-router-dom"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

const getWeekString = (date) => {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weekNumber = Math.ceil((dayOfYear + start.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${('0' + weekNumber).slice(-2)}`;
};

const Dashboard = () => {
  const { users, currentUser } = useSelector((state) => state.users)
  const dispatch = useDispatch()
  const token = getToken()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token))
    }
    else {
      navigate("/login")
    }
    dispatch(fetchUsers())
  }, [token, dispatch])

  useEffect(() => {
    if (currentUser && currentUser.role !== "ADMIN") {
      navigate("/")
    }
  }, [currentUser])

  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {})

  const roleData = Object.keys(roleCounts).map(role => ({
    name: role,
    value: roleCounts[role]
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const roles = ['ADMIN', 'STAFF', 'STUDENT', 'MANAGER'];
  const monthlyData = {};
  users.forEach(user => {
    const date = new Date(user.createdAt);
    const monthYear = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`;
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { month: monthYear };
      roles.forEach(role => monthlyData[monthYear][role] = 0);
    }
    if (roles.includes(user.role)) {
      monthlyData[monthYear][user.role] += 1;
    }
  });

  const [sortBy, setSortBy] = useState("month");
  const [granularity, setGranularity] = useState("day");

  let sortedData = [];
  if (sortBy === "month") {
    const groupData = {};
    users.forEach(user => {
      const date = new Date(user.createdAt);
      let key = "";
      if (granularity === "day") {
        key = date.toISOString().split("T")[0];
      } else if (granularity === "week") {
        key = getWeekString(date);
      }
      if (!groupData[key]) {
        groupData[key] = { period: key };
        roles.forEach(role => groupData[key][role] = 0);
      }
      if (roles.includes(user.role)) {
        groupData[key][user.role] += 1;
      }
    });
    sortedData = Object.values(groupData).sort((a, b) => a.period.localeCompare(b.period));
  } else {
    sortedData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  }

  return (
    <div className="space-y-6" style={{ marginLeft: '10rem', marginTop: '1rem' }}>
      <div>
        <h2 className="text-2xl font-bold">Charts Users</h2>
        <div className="mt-8">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button onClick={() => setSortBy("month")}>Month</button>
          <button onClick={() => setSortBy("year")}>Year</button>
          {sortBy === "month" && (
            <>
              <button onClick={() => setGranularity("day")}>Day</button>
              <button onClick={() => setGranularity("week")}>Week</button>
            </>
          )}
        </div>
        <ResponsiveContainer width="100%" height={270}>
          <LineChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ADMIN" stroke="#8884d8" name="ADMIN" />
            <Line type="monotone" dataKey="STAFF" stroke="#82ca9d" name="STAFF" />
            <Line type="monotone" dataKey="STUDENT" stroke="#ff7300" name="STUDENT" />
            <Line type="monotone" dataKey="MANAGER" stroke="#387908" name="MANAGER" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const DashboardCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <Icon className="text-primary h-8 w-8" />
    </div>
  </div>
)

export default Dashboard
