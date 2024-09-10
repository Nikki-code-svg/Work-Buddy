
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ImageInfo({ jobsiteId, loading, jobsiteName }) {
    const { id } = useParams();
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [inputValues, setInputValues] = useState({});

    useEffect(() => {
        if (jobsiteId && id) {
            fetch(`/api/jobsite/${jobsiteId}/images/${id}`)
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('Failed to fetch image data');
                    }
                })
                .then(data => {
                    setImage(data);
                    setInputValues(data);
                })
                .catch(error => {
                    console.error('Error fetching image:', error);
                    setError(error.message);
                });
        }
    }, [id, jobsiteId]);

    const handleInputChange = (key, value) => {
        setInputValues(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const toggleEditMode = () => {
        if (isEditable) {
            const payload = {
                location: inputValues.location,
                note: inputValues.note,
                url: inputValues.url
            };

            fetch(`/api/jobsites/${image.jobsite_id}/images/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to update image data');
                }
                return res.json();
            })
            .then(data => {
                setImage(data);
                setIsEditable(false);
            })
            .catch(error => {
                console.error('Error updating image:', error);
                setError(error.message);
            });
        } else {
            setIsEditable(true);
        }
    };

    if (error) return <p>Error: {error}</p>;
    if (!image) return <p>No Image data found</p>;

    return (
        <>
            <div className='jobsite-info-container'>
                <div>
                    <h2>Location</h2>
                    {isEditable ? (
                        <input
                            name='location'
                            type='text'
                            value={inputValues.location || ''}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                    ) : (
                        <p>{image.location}</p>
                    )}
                </div>
                <div>
                    <h2>Note</h2>
                    {isEditable ? (
                        <textarea
                            name='note'
                            value={inputValues.note || ''}
                            onChange={(e) => handleInputChange('note', e.target.value)}
                        />
                    ) : (
                        <p>{image.note}</p>
                    )}
                </div>
                <div>
                    <h2>Image</h2>
                    {isEditable ? (
                        <input
                            name='url'
                            type='text'
                            value={inputValues.url || ''}
                            onChange={(e) => handleInputChange('url', e.target.value)}
                        />
                    ) : (
                        <img src={image.url} alt={image.location} style={{ maxWidth: '100%' }}/>
                    )}
                </div>
                <button 
                    className='edit-btn-m'
                    onClick={toggleEditMode}>
                    {isEditable ? 'Save' : 'Edit Data'}
                </button>
            </div>
        </>
    );
}

export default ImageInfo;
