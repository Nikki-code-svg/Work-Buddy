
import React, { useEffect, useState } from 'react';
import UploadWidget from '../UploadWidget';
import DisplayImage from '../DisplayImage';

const Prints = ({ jobsiteId, jobsiteName}) => {
    const [prints, setPrints] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchPrints = async () => {
            console.log(`Fetching prints for jobsiteId: ${jobsiteId}`); 
            try {
                const response = await fetch(`/api/jobsites/${jobsiteId}/prints`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Fetched prints:', data); 
                setPrints(data);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching prints:', error);
            }
        };
    
        fetchPrints();
    }, [jobsiteId]);
    

    return (
        <div className='print-container'>
            <h1 className='print-title'>Prints for Jobsite {jobsiteName}</h1>
            <UploadWidget setImageUrls={setImageUrls} />
            {error && <p>{error}</p>}
            {prints.length > 0 ? (
                prints.map((print) => (
                    <DisplayImage key={print.id} publicId={print.url} jobsiteId={jobsiteId } />
                ))
            ) : (
                <p>No prints available.</p>
            )}
            {imageUrls.length > 0 && (
                <div>
                    <h2>Uploaded Images</h2>
                    {imageUrls.map((url, index) => (
                       <img  className='.small-image-prints' key={index} src={url} alt={`Uploaded ${index}`} style={{ width: '400px', height: '400px' }} />

                    ))}
                </div>
            )}
        </div>
    );
};

export default Prints;










