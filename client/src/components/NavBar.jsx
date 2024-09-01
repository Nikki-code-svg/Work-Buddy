import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar({ currentUser, handleLogout }) {
  return (
    <nav role="navigation" className="navbar">
      
      {currentUser ? (
        <>
          <NavLink to="/">Home</NavLink>
          {/* <NavLink to="/jobsites">Jobsites</NavLink> */}
          <NavLink to="/materials">Material lists</NavLink>
          <NavLink to="/punchlist">Punch List</NavLink>
          <NavLink to="/prints">Prints</NavLink>
          <NavLink to="/image">Images</NavLink>
         
      
        </>
      ) : (
        <div className="parent-container">
          <h3 className='title'>Work Buddy</h3>
        </div>
         
      )}
    </nav>
  );
}

export default NavBar;




