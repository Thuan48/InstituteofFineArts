import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Auth/Login';
import DashboardLayout from './components/Admin/DashboardLayout';
import Dashboard from './components/Admin/Dashboard';
import ListUser from './components/Admin/ListUser';
import StudentLayout from './components/Student/StudentLayout';
import StudentDashboard from './components/Student/StudentDashboard';
import Competitions from './components/Competitions';
import CompetitionDetail from './components/CompetitionDetail';
import ManagerLayout from './components/Manager/ManagerLayout';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import UserDetail from './components/User/UserDetail';
import ListCompetition from './components/Manager/ListCompetition';
import ListSubmission from './components/Manager/ListSubmission';
import ListExhibition from './components/Manager/ListExhibition';
import Exhibition from './components/Student/Exhibition';
import StaffLayout from './components/Staff/StaffLayout';
import StaffDashboard from './components/Staff/StaffDashboard';
import Student from './components/Staff/Student';
import ExhibitionPage from './components/ExhibitionPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<DashboardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<ListUser />} />
      </Route>
      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="exhibition" element={<Exhibition />} />
      </Route>
      <Route path="/competition" element={<Competitions />} />
      <Route path="/competition/:id" element={<CompetitionDetail />} />
      <Route path="/manager" element={<ManagerLayout />}>
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="competitions" element={<ListCompetition />} />
        <Route path="exhibition" element={<ListExhibition />} />
        <Route path="competitions/:competitionId/submissions" element={<ListSubmission />} />
      </Route>
      <Route path="/staff" element={<StaffLayout />}>
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="students" element={<Student />} />
      </Route>
      <Route path="/user/:id" element={<UserDetail />} />
      <Route path="/exhibition" element={<ExhibitionPage />} />
    </Routes>
  );
}

export default App;
