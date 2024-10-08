import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function JobsiteInfo({ loading, setLoading, setSelectedJobsite }) {
    const { id } = useParams();
    const [jobsite, setJobsite] = useState(null);
    const [error, setError] = useState(null);

    const [isEditable, setIsEditable] = useState(false);
    const [inputValues, setInputValues] = useState({});

    console.log(jobsite)
    useEffect(() => {
        
        fetch(`/api/jobsites/${id}`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch jobsite data');
                }
            })
            .then(data => {
                setJobsite(data);
                setSelectedJobsite(data); 
                setInputValues(data);
                
            })
            .catch(error => {
                setError(error.message);
            });
    }, [id,  setSelectedJobsite]);

    const handleInputChange = (key, value) => {
        setInputValues(prev => ({
            ...prev,
            [key]: value,
        }));
    };

 
 let toggleEditMode = () => {
        if (isEditable) {
            const { id, images, materials, prints, punchlists, user, user_id, ...updateData } = inputValues;
            
            console.log("Updating jobsite with data:", updateData); 
    
            fetch(`/api/jobsites/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to update jobsite data');
                }
                return res.json();
            })
            .then(data => {
                setJobsite(data); 
                setIsEditable(false); 
                setError(null);
            })
            .catch(error => {
                setError(error.message);
            });
        } else {
            setIsEditable(true);
        }
    };
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!jobsite) return <p>No jobsite data found</p>;

    return (
        <div className='jobsite-info-container'>
            <table>
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td>
                            {isEditable ? (
                                <input
                                    className='job-input-edit'
                                    name='name'
                                    type='text'
                                    value={inputValues.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                            ) : (
                                jobsite.name
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Location</td>
                        <td>
                            {isEditable ? (
                                <input
                                    className='job-input-edit'
                                    name='location'
                                    type='text'
                                    value={inputValues.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                />
                            ) : (
                                jobsite.location
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Start Date</td>
                        <td>
                            {isEditable ? (
                                <input
                                    className='job-input-edit'
                                    name='startdate'
                                    type='text'
                                    value={inputValues.startdate}
                                    onChange={(e) => handleInputChange('startdate', e.target.value)}
                                />
                            ) : (
                                jobsite.startdate
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>End Date</td>
                        <td>
                            {isEditable ? (
                                <input
                                    className='job-input-edit'
                                    name='enddate'
                                    type='text'
                                    value={inputValues.enddate}
                                    onChange={(e) => handleInputChange('enddate', e.target.value)}
                                />
                            ) : (
                                jobsite.enddate
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Note</td>
                        <td>
                            {isEditable ? (
                                <input
                                    className='job-input-edit'
                                    name='note'
                                    type='text'
                                    value={inputValues.note}
                                    onChange={(e) => handleInputChange('note', e.target.value)}
                                />
                            ) : (
                                jobsite.note
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
            <button 
                className='edit-btn-m'
                onClick={toggleEditMode}>
                {isEditable ? 'Save' : 'Edit Data'}
            </button>
        </div>
    );
}

export default JobsiteInfo;
