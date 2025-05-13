import ProjectCard from './components/userboard/ProjectCard.jsx'
import AuthPage from './pages/AuthPage.jsx'
import HomePage from './pages/HomePage.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserPage from './pages/UserPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import { AuthProvider } from './contexts/AuthContext'
import TaskPage from './pages/TaskPage.jsx'

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected routes */}
          <Route 
            path="/user" 
            element={
              <PrivateRoute 
                element={<UserPage />} 
                allowedRoles={["user"]} 
              />
            } 
          />
          <Route 
            path="/user/project/:id" 
            element={
              <PrivateRoute 
                element={<TaskPage />} 
                allowedRoles={["user"]} 
              />
            } 
          />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute 
                element={<AdminDashboard />} 
                allowedRoles={["admin"]} 
              />
            } 
          />

          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
