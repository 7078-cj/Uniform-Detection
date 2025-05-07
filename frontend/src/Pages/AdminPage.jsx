import React, { useState } from 'react'
import NavBar from '../Components/NavBar'
import RegisterStudentForm from '../Components/RegisterStudentForm'
import ScanPage from '../Components/ScanPage'

function AdminPage() {

  const [page, setPage] = useState("home")

  return (
    <>
        <NavBar setPage={setPage}></NavBar>
        { page === "home" ? 
          (<div>AdminPage</div>) : 
          page === "scan" ? 
          (<ScanPage/>) : 
          page === "registerStudent" ? 
          ( <RegisterStudentForm/>) : 
          (<div></div>) 
        }
       
    </>
  )
}

export default AdminPage