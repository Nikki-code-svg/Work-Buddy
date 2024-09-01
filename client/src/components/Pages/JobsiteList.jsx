
import React, { useEffect, useState } from 'react';
import JobCard from './JobCard';
import NewJob from './NewJob';
import { useNavigate } from 'react-router-dom';

function JobsiteList({ search, setSearch, setSelectedJobsite }) {
   const [jobsites, setJobsites] = useState([]);
   const navigate = useNavigate();
   console.log(search)
   useEffect(() => {
     fetch('/api/jobsites')
     .then(response => response.json())
     .then(data => setJobsites(data))
     .catch(error => console.error('Error fetching data:', error));
   }, []);

   const handleAddJobsite = (newJob) => {
    setJobsites(prevJobsites => [newJob, ...prevJobsites]);
    navigate(`/jobsites/${newJob.id}`);
   };

   const filteredJobsites = jobsites.filter((jobsite) =>
      jobsite.name.toLowerCase().includes(search.toLowerCase())
   );
   
   const handleDelete = (id) => {
    fetch(`/api/jobsites/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            setJobsites(prevJobsites => prevJobsites.filter(jobsite => jobsite.id !== id));
        } else {
            console.error('Failed to delete the jobsite');
        }
    })
    .catch(error => console.error('Error deleting jobsite:', error));
};



   return (
        <main className="jobsitelist-container">
            <div className=' equal-section newjob'>
              <NewJob handleAddJobsite={handleAddJobsite} />
            </div>
            <div className='equal-section newjob'>
            <div className='searchbar-josbsite'>
                <input
                    type="text"
                    placeholder="Search Jobsites"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ margin: '20px 0', padding: '10px', width: '100%' }}
                />
            </div>
            <div>
                
                <div className='display-jobsites'>
                <h2 className='jobsite-title'>JobSites</h2>
                    {filteredJobsites.map((jobsite) => (
                        <JobCard 
                            key={jobsite.id} 
                            jobsite={jobsite} 
                            handleDelete={() => handleDelete(jobsite.id)} 
                            onClick={() => {
                                setSelectedJobsite(jobsite);
                                setSearch('');
                                navigate(`/jobsite/${jobsite.id}`);
                            }}
                        />
                    ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default JobsiteList;




