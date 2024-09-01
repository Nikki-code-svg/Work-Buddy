// import React, { useEffect, useState } from 'react';
// import MaterialCard from './MaterialCard';
// import NewMaterial from './NewMaterial';
// import { useNavigate } from 'react-router-dom';


// function MaterialList({ search, setSearch, setSelectedMaterial }) {
//    const [materials, setMaterials] = useState([]);
//    const navigate = useNavigate();

//    console.log(materials)

//    useEffect(() => {
//      fetch('/api/materials')
//      .then(response => response.json())
//      .then(data => setMaterials(data))
//      .catch(error => console.error('Error fetching data:', error));
//    }, []);

//    const handleAddMaterial = (newMaterial) => {
//     console.log('New Material:', newMaterial);
//     setMaterials(prevMaterials => [newMaterial, ...prevMaterials]);
//     navigate(`/materials/${newMaterial.id}`);
//    };


//    const filteredMaterials = materials.filter((material) =>
//     material.datelist && material.datelist.toLowerCase().includes(search.toLowerCase())
//  );
    
//    const handleDelete = (id) => {
//     fetch(`/api/materials/${id}`, {
//         method: 'DELETE',
//     })
//     .then(response => {
//         if (response.ok) {
//             setMaterials(prevMaterials => prevMaterials.filter(material => material.id !== id));
//         } else {
//             console.error('Failed to delete the material');
//         }
//     })
//     .catch(error => console.error('Error deleting material:', error));
// };


// return (
//     <main className="materiallist-container">
//            <div className='new-material'>
//             <NewMaterial handleAddMaterial={handleAddMaterial} />
//         </div>
//         <div className='material-search-bar'>
//             <input
//                 type="text"
//                 placeholder="Search Jobsites"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 style={{ margin: '20px 0', padding: '10px', width: '100%' }}
//             />
//             </div>
//             <div className='material-cards'>
//             <h2>Materials Lists</h2>
//             {materials.length > 0 ? (
//                 <div>
//                     {filteredMaterials.map((material) => (
//                         <MaterialCard
//                             key={material.id}
//                             material={material}
//                             handleDelete={() => handleDelete(material.id)}
//                             onClick={() => {
//                                 setSelectedMaterial(material);
//                                 setSearch('');
//                                 navigate(`/materials/${material.id}`);
//                             }}
//                         />
//                     ))}
//                 </div>
//             ) : (
//                 <p>No materials available.</p>
//             )}
//         </div>
//     </main>
// );
// }
// export default MaterialList;
import React, { useEffect, useState } from 'react';
import MaterialCard from './MaterialCard';
import NewMaterial from './NewMaterial';
import { useNavigate } from 'react-router-dom';

function MaterialList({ search, setSearch, setSelectedMaterial }) {
   const [materials, setMaterials] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
     fetch('/api/materials')
     .then(response => response.json())
     .then(data => setMaterials(data))
     .catch(error => console.error('Error fetching data:', error));
   }, []);

   const handleAddMaterial = (newMaterial) => {
    setMaterials(prevMaterials => [newMaterial, ...prevMaterials]);
    navigate(`/materials/${newMaterial.id}`);
   };

   const filteredMaterials = materials.filter((material) =>
    material.datelist && material.datelist.toLowerCase().includes(search.toLowerCase())
   );
    
   const handleDelete = (id) => {
    fetch(`/api/materials/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            setMaterials(prevMaterials => prevMaterials.filter(material => material.id !== id));
        } else {
            console.error('Failed to delete the material');
        }
    })
    .catch(error => console.error('Error deleting material:', error));
   };

   return (
    <main className="materiallist-container">
        <div className="equal-section new-material">
            <NewMaterial handleAddMaterial={handleAddMaterial} />
        </div>
        <div className="equal-section material-section">
            <div className="material-search-bar">
                <input
                    type="text"
                    placeholder="Search Jobsites"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ margin: '20px 0', padding: '10px', width: '100%' }}
                />
            </div>
            <div className="material-cards">
                <h2 className='material-title'>Materials Lists</h2>
                {materials.length > 0 ? (
                    <div>
                        {filteredMaterials.map((material) => (
                            <MaterialCard
                                key={material.id}
                                material={material}
                                handleDelete={() => handleDelete(material.id)}
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






