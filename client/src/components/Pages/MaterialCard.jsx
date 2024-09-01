import React from 'react';
import { Link } from 'react-router-dom';


function MaterialCard({ material, handleDelete }) {
    return (
        <div className='material-card'>
            <Link to={`/materials/${material.id}`}>
                <button className='materialbtn'>{material.datelist}</button>
            </Link>
            <button 
                    className='deletebtn'
                    onClick={() => handleDelete(material.id)} 
                    style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
            >
                    Delete
            </button>

        </div>
    );
}

export default MaterialCard;