import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CopyButton from '../ClipBoard';

function MaterialInfo({ loading, setLoading, jobsiteName }) {
    const { id } = useParams();
    const [material, setMaterial] = useState(null);
    const [error, setError] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [inputValues, setInputValues] = useState({});

    useEffect(() => {
        if (!jobsiteName) {
            return;
        }
        fetch(`/api/materials/${id}`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch Material data');
                }
            })
            .then(data => {
                if (typeof data.content === 'string') {
                    data.content = data.content.split('\n');
                }
                setMaterial(data);
                setInputValues(data);
            })
            .catch(error => {
                setError(error.message);
            });
    }, [id]);

    const handleInputChange = (key, value) => {
        setInputValues(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const toggleEditMode = () => {
        if (isEditable) {
            const payload = {
                datelist: inputValues.datelist,
                content: inputValues.content.join('\n'),
            };

            fetch(`/api/jobsites/${material.jobsite_id}/materials/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to update material data');
                }
                return res.json();
            })
            .then(data => {
                setMaterial(data);
                setIsEditable(false);
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
    if (!material) return <p>No Material data found</p>;

    return (
        <div className='material-info-container'>
            <table>
                <thead>
                    <tr>
                        <th>{jobsiteName}</th>
                        <th>Date List</th>
                        <th>Content</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {isEditable ? (
                                <input
                                    className='material-date'
                                    name='datelist'
                                    type='text'
                                    value={inputValues.datelist || ''}
                                    onChange={(e) => handleInputChange('datelist', e.target.value)}
                                />
                            ) : (
                                material.datelist || 'No date available'
                            )}
                        </td>
                        <td>
                            <CopyButton className='copybtnM' textToCopy={inputValues.content.join('\n')} />
                            {isEditable ? (
                                <textarea
                                    name='content'
                                    value={inputValues.content.join('\n') || ''}
                                    onChange={(e) => handleInputChange('content', e.target.value.split('\n'))}
                                />
                            ) : (
                                Array.isArray(material.content) ? material.content.map((item, index) => (
                                    <p key={index}>{item}</p>
                                )) : <p>{material.content}</p>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
            <button onClick={toggleEditMode}>
                {isEditable ? 'Save' : 'Edit Data'}
            </button>
        </div>
    );
}

export default MaterialInfo;


