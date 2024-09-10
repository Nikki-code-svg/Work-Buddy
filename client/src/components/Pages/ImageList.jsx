
import React, { useEffect, useState } from 'react';
import ImageCard from './ImageCard';
import NewImage from './NewImage';
import { useNavigate } from 'react-router-dom';

function ImageList({ search, setSearch, jobsiteId }) {
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/jobsites/${jobsiteId}/images`)
            .then(response => response.json())
            .then(data => setImages(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [jobsiteId]);

    const handleAddImages = (newImage) => {
        setImages(prevImages => [newImage, ...prevImages]);
        navigate(`/images/${newImage.id}`);
    };

    const filteredImages = images.filter((image) =>
        image.location.toLowerCase().includes(search.toLowerCase())
    );
    
    const handleDelete = (imageId) => {
        fetch(`/api/jobsites/${jobsiteId}/images/${imageId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setImages(prevImages => prevImages.filter(image => image.id !== imageId));
            } else {
                console.error('Failed to delete the image');
            }
        })
        .catch(error => console.error('Error deleting image:', error));
    };

    return (
        <main className="image-container">
            <div className="new-image">
                <NewImage handleAddImages={handleAddImages} jobsiteId={jobsiteId} />
            </div>
            <div className="image-section">
                <div className="image-search-bar">
                    <input
                        className='search-input-image'
                        type="text"
                        placeholder="Search Images"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ margin: '20px 0', padding: '10px', width: '100%' }}
                    />
                </div>
                <div className="image-cards">
                    <h2 className='image-title'>Images</h2>
                    {images.length > 0 ? (
                        <div>
                            {filteredImages.map((image) => (
                                <ImageCard
                                    key={image.id}
                                    image={image}
                                    handleDelete={() => handleDelete(image.id)}
                                    onClick={() => navigate(`/images/${image.id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>No images available.</p>
                    )}
                </div>
            </div>
        </main>
    );
}

export default ImageList;
