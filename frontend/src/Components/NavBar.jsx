import React, { useContext } from 'react'
import AuthContext from '../Context/AuthContext'


function NavBar({ setPage }) {
  const {role } = useContext(AuthContext)
  return (
    <div>
      NavBar
      {role === "Admin" && 
        <div><button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('scan')}>Scan</button>
        <button onClick={() => setPage('registerStudent')}>Register Student</button></div>
      }
      {role === "Student" && 
        <div>
          <button onClick={() => setPage('Studenthome')}>Home</button>
          <button onClick={() => setPage('StudentLog')}>Student Log</button>
        </div>
        
      }
      
    </div>
  )
}

export default NavBar