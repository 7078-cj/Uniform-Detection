import React from 'react'
import NavBar from '../Components/NavBar'
import RegisterStudentForm from '../Components/RegisterStudentForm'

function AdminPage() {
  return (
    <>
        <NavBar></NavBar>
        <div>AdminPage</div>
        <RegisterStudentForm/>
    </>
  )
}

export default AdminPage