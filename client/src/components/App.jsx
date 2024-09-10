import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NavBar from './NavBar';
import Login from './UserPanel/Login';
import Signup from './UserPanel/Signup';
import JobsiteInfo from "./Pages/JobsiteInfo";
import JobsiteList from "./Pages/JobsiteList";
import UserDetails from './UserPanel/UserDetails';
import MaterialInfo from "./Pages/MaterialInfo";
import MaterialList from "./Pages/MaterialList";
import PunchList from "./Pages/PunchList";
import Prints from "./Pages/Prints";
import ImageInfo from "./Pages/ImageInfo"
import ImageList from "./Pages/ImageList"
import DisplayImage from "./DisplayImage";


function App() {
    const [search, setSearch] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedJobsite, setSelectedJobsite] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/check_session')
            .then(res => res.ok ? res.json() : Promise.reject('Failed to check session'))
            .then(data => {
                setCurrentUser(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error checking session:', error);
                setLoading(false);
            });
    }, []);

    const handleLogout = () => {
        fetch('/api/logout', { method: 'DELETE' })
            .then(res => res.ok ? setCurrentUser(null) : console.error('Failed to logout'))
            .catch(error => console.error('Error logging out:', error));
    };

    const handleHomeClick = () => {
        setSelectedJobsite(null);  // Reset selectedJobsite when Home is clicked
    };

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className='app App'>
            <NavBar 
                currentUser={currentUser} 
                selectedJobsite={selectedJobsite} 
                handleLogout={handleLogout} 
                handleHomeClick={handleHomeClick} 
            />
            <Routes>
                <Route 
                    path="/" 
                    element={currentUser 
                        ? <UserDetails 
                            currentUser={currentUser} 
                            setSearch={setSearch} 
                            search={search} 
                            setCurrentUser={setCurrentUser} 
                            loading={loading} 
                            setLoading={setLoading} 
                          /> 
                        : <Navigate to="/login" />} 
                />
                <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
                <Route path="/signup" element={<Signup setCurrentUser={setCurrentUser} />} />
               
                <Route 
                    path="/jobsites" 
                    element={currentUser 
                        ? <JobsiteList
                            search={search}  
                            setSearch={setSearch} 
                            setSelectedJobsite={setSelectedJobsite} 
                          /> 
                        : <Navigate to="/login" />} 
                />
                <Route 
                    path="/jobsite/:id" 
                    element={currentUser 
                        ? <JobsiteInfo
                            loading={loading} 
                            setLoading={setLoading} 
                            setSelectedJobsite={setSelectedJobsite} 
                          /> 
                        : <Navigate to="/login" />} 
                />
                {selectedJobsite && (
                    <Route 
                        path="/materials" 
                        element={currentUser 
                            ? <MaterialList 
                                loading={loading} 
                                setLoading={setLoading} 
                                search={search} 
                                setSearch={setSearch} 
                                jobsiteId={selectedJobsite.id} 
                                jobsiteName={selectedJobsite.name} 
                              /> 
                            : <Navigate to="/login" />} 
                    />
                    )}
                {selectedJobsite && (
                    <Route 
                    path="/punchlist" 
                    element={currentUser 
                        ? <PunchList 
                            loading={loading} 
                            setLoading={setLoading} 
                            jobsiteId={selectedJobsite.id} 
                            jobsiteName={selectedJobsite.name} 
                          /> 
                        : <Navigate to="/login" />} 
                    />
                    )}
                    {selectedJobsite && (
                    <Route 
                    path="/prints" 
                    element={currentUser 
                        ? <Prints 
                            loading={loading} 
                            setLoading={setLoading} 
                            jobsiteId={selectedJobsite.id} 
                            jobsiteName={selectedJobsite.name} 
                          /> 
                        : <Navigate to="/login" />} 
                    />

                    )}
                    {selectedJobsite && (
                    <Route 
                        path="/print/:id" 
                        element={currentUser 
                        ? <DisplayImage 
                            loading={loading} 
                            setLoading={setLoading} 
                            jobsiteId={selectedJobsite.id} 
                          /> 
                        : <Navigate to="/login" />} 
                    />
                )}

                <Route 
                    path="/materials/:id" 
                    element={currentUser && selectedJobsite 
                        ? <MaterialInfo 
                            loading={loading} 
                            setLoading={setLoading} 
                            jobsiteName={selectedJobsite.name} 
                          /> 
                        : <Navigate to="/login" />} 
                />
                
                {selectedJobsite && (
                <Route 
                    path="/images" 
                    element={currentUser 
                        ? <ImageList
                            loading={loading} 
                            setLoading={setLoading} 
                            search={search} 
                            setSearch={setSearch} 
                            jobsiteId={selectedJobsite.id} 
                            jobsiteName={selectedJobsite.name} 
                          /> 
                        : <Navigate to="/login" />} 
                />
            )}
                 {selectedJobsite && (
                <Route 
                    path="/images/:id" 
                    element={currentUser && selectedJobsite 
                        ? <ImageInfo 
                            loading={loading} 
                            setLoading={setLoading} 
                            jobsiteId={selectedJobsite.id} 
                            jobsiteName={selectedJobsite.name} 
                          /> 
                        : <Navigate to="/login" />} 
                />
            )}
                  
            </Routes>
        </div>
    );
}

export default App;







  


