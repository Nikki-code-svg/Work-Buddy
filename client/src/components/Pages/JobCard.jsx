
import React from 'react';
import { Link } from 'react-router-dom';

function JobCard({ jobsite, handleDelete }) {
    return (
        <div className="job-card-container">
            <Link to={`/jobsite/${jobsite.id}`}>
                <button className='jobsiteNbtn'>{jobsite.name}</button>
            </Link>
            <button 
                onClick={() => handleDelete(jobsite.id)} 
                style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
            >
                Delete
            </button>
        </div>
    );
}

export default JobCard;

