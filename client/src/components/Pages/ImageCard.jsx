import React from 'react';
import { Link } from 'react-router-dom';

function ImageCard({ image, handleDelete }) {
    return (
        
        <div className='image-card' style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Link to={`/images/${image.id}`}>
                <img 
                    src={image.url} 
                    alt={image.note || 'Image'} 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                />
            </Link>
            <div className="note">{image.note}</div>
            <button 
                className='deletebtn'
                onClick={() => handleDelete(image.id)} 
                style={{ backgroundColor: 'red', color: 'white' }}
            >
                Delete
            </button>
        </div>
    );
}

export default ImageCard;

