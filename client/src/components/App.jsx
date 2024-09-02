import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NavBar from './NavBar';
import Login from './UserPanel/Login';
import Signup from './UserPanel/Signup';
import JobsiteInfo from "./Pages/JobsiteInfo";
import UserDetails from './UserPanel/UserDetails';
import MaterialInfo from "./Pages/MaterialInfo";
import MaterialList from "./Pages/MaterialList";
import PunchList from "./Pages/PunchList"
import Prints from "./Pages/Prints";
// import UploadWidget from "./UploadWidget";



function App() {
    const [search, setSearch] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedJobsite, setSelectedJobsite] = useState(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/check_session')
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Failed to check session');
      })
      .then(data => {
        setCurrentUser(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error checking session:', error);
        setLoading(false);
      });
  }, []);

  function handleLogout() {
    fetch('/api/logout', { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setCurrentUser(null);
        } else {
          console.error('Failed to logout');
        }
      })
      .catch(error => console.error('Error logging out:', error));
  }

  if (loading) {
    return <h1>Loading...</h1>;

  }

    return (
         <div className='app App'>
          
            <NavBar currentUser={currentUser} jobsite={selectedJobsite} handleLogout={handleLogout} />
            <Routes>
                <Route path="/" element={currentUser ? <UserDetails currentUser={currentUser} setSearch={setSearch} search={search} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />} />  
                <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
                <Route path="/signup" element={<Signup setCurrentUser={setCurrentUser} />} />
                <Route path="/jobsite/:id" element={currentUser ? <JobsiteInfo loading={loading} setLoading={setLoading} setSelectedJobsite={setSelectedJobsite}/> : <Navigate to="/login" />} />
                {selectedJobsite && (
                    <Route path="/materials" element={currentUser ? <MaterialList loading={loading} setLoading={setLoading} search={search} setSearch={setSearch} jobsiteId={selectedJobsite.id} /> : <Navigate to="/login" />} />
                )}
               
                <Route path="/materials/:id" element={currentUser ? <MaterialInfo loading={loading} setLoading={setLoading} /> : <Navigate to="/login" />} />
                <Route path="/punchlist" element={currentUser ? <PunchList loading={loading} setLoading={setLoading} /> : <Navigate to="/login" />} />
                <Route path="/prints" element={currentUser ? <Prints loading={loading} setLoading={setLoading} /> : <Navigate to="/login" />} /> 
                <Route path="/image" element={currentUser ? <Image loading={loading} setLoading={setLoading} /> : <Navigate to="/login" />} /> 
           
            </Routes>
            </div>
    );
}

export default App;




  


