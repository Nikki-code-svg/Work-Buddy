import React, { useEffect, useState } from 'react';
import MaterialCard from './MaterialCard';
import NewMaterial from './NewMaterial';
import { useNavigate } from 'react-router-dom';

function MaterialList({ search, setSearch, setSelectedMaterial, jobsiteId, jobsiteName  }) {
   const [materials, setMaterials] = useState([]);
 
   const navigate = useNavigate();
   if (!jobsiteName) {
    return <div>No job site selected</div>;
}

   useEffect(() => {
     fetch(`/api/jobsites/${jobsiteId}/materials`)
     .then(response => response.json())
     .then(data => setMaterials(data))
     .catch(error => console.error('Error fetching data:', error));
   }, [jobsiteId]);
   console.log('Jobsite ID:', jobsiteId);

   const handleAddMaterial = (newMaterial) => {
    setMaterials(prevMaterials => [newMaterial, ...prevMaterials]);
    navigate(`/materials/${newMaterial.id}`);
   };

   const filteredMaterials = materials.filter((material) =>
    material.datelist && material.datelist.toLowerCase().includes(search.toLowerCase())
   );
   const handleDelete = (jobsiteId, materialId) => {
    fetch(`/api/jobsites/${jobsiteId}/materials/${materialId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            setMaterials(prevMaterials => prevMaterials.filter(material => material.id !== materialId));
        } else {
            response.json().then(data => console.error('Failed to delete the material:', data.error));
        }
    })
    .catch(error => console.error('Error deleting material:', error));
};



   return (
    <main className="materiallist-container">
        <div className="equal-section new-material">
            <NewMaterial handleAddMaterial={handleAddMaterial} jobsiteId={jobsiteId}/>
        </div>
        <div className="equal-section material-section">
            <div className="material-search-bar">
                <input
                    className='seach-input-m'
                    type="text"
                    placeholder="Search Materials"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ margin: '20px 0', padding: '10px', width: '100%' }}
                />
            </div>
            <div className="material-cards">
                <h2 className='material-title'>Materials for {jobsiteName}</h2>
                {materials.length > 0 ? (
                    <div>
                        {filteredMaterials.map((material) => (
                            <MaterialCard
                                key={material.id}
                                material={material}
                                handleDelete={() => handleDelete(jobsiteId, material.id)}
                                onClick={() => {
                                    setSelectedMaterial(material);
                                    setSearch('');
                                    navigate(`/materials/${material.id}`);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No materials available.</p>
                )}
            </div>
        </div>
    </main>
);
}

export default MaterialList;






