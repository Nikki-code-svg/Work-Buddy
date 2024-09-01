import React from 'react'
import JobsiteList from '../Pages/JobsiteList'


function UserDetails({currentUser, setCurrentUser, search,  setSearch, setSelectedJobsite}) {

    function handleLogout() {
      setCurrentUser(null) 
      fetch('/api/logout', { method: 'DELETE' })
    }

    if (!currentUser) {
      return <p>Loading user details...</p>
    }
  
      return (
        <div className='user-details'>
         
          <h2>Welcome {currentUser.username}!</h2>
          <button className='logoutbtn' onClick={handleLogout}>Logout</button>
          <JobsiteList  search={search}  setSearch={setSearch} setSelectedJobsite={setSelectedJobsite}/>
        </div>
        
      )
    
    }
    
    export default UserDetails
