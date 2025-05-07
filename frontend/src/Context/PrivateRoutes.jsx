import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from './AuthContext'

function PrivateRoutes({ children }) {
  const { user, role } = useContext(AuthContext)
  const currentPath = window.location.pathname

  
  if (!user) {
    return <Navigate to="/login" replace />
  }

  
  const isAdminRoute = currentPath === "/admin"
  const isStudentRoute = currentPath === "/student" 
  const isHomeRoute = currentPath === "/"

  
  if (role === "Admin" && !isAdminRoute) {
    return <Navigate to="/admin" replace />
  } else if (role === "Student" && !isStudentRoute) {
    return <Navigate to="/student" replace />
  } else if (role !== "Admin" && role !== "Student" && !isHomeRoute) {
    return <Navigate to="/" replace />
  }
  
  
  return children
}

export default PrivateRoutes