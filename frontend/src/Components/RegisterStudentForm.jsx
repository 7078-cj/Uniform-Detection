import React from 'react'

function RegisterStudentForm() {

    var RegisterStudent = async(e) =>{
        e.preventDefault();

        let response = await fetch(
          "http://127.0.0.1:8000/api/students/",{
            method: "POST",
            headers:{
              'Content-Type' : 'application/json',
             
            },
            body :JSON.stringify({
                                  'firstName' :e.target.firstName.value,
                                  'middleInitial' :e.target.middleInital.value,
                                  'lastName' :e.target.lastName.value,
                                  'studentCode' :e.target.studentCode.value,
                                  'course' :e.target.course.value,
                                  'year_level' :e.target.year_level.value,
                                    'email':e.target.email.value,
                                  'password' :e.target.password.value,
                                  
                                  })
          }
        )
        let data = await response.json()
                console.log(data)
                if (response.status ==200){
                  loginUser(e)
                  nav('/')
      }
    }

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      
      <form onSubmit={RegisterStudent} className="flex flex-col justify-center items-center space-y-2">
        <input 
          type="text" 
          name="firstName" 
          placeholder="Enter First Name" 
          className='outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300' 
        />

        <input 
          type="text" 
          name="middleInitial" 
          placeholder="Enter Middle Initial" 
          className='outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300' 
        />

        <input 
          type="text" 
          name="lastName" 
          placeholder="Enter Last Name" 
          className='outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300' 
        />

        <input 
          type="text" 
          name="studentCode" 
          placeholder="Enter Student Code" 
          className='outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300' 
        />

        <input 
          type="email" 
          name="email" 
          placeholder="Enter User Email" 
          className='outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300'  
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Enter Password" 
          className='outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300'  
        />

        <input 
          type="text" 
          name="course" 
          placeholder="Enter Student Course" 
          className='outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300' 
        />

        <input 
          type="text" 
          name="year_level"
          placeholder="Enter Year Level" 
          className='outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300' 
        />

        <input 
          type="submit" 
          value="Register" 
          className='w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2'  
        />
    </form>
    
 
      
    </div>
  )
}

export default RegisterStudentForm