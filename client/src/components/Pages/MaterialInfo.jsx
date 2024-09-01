
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CopyButton from '../ClipBoard';

function MaterialInfo({ loading, setLoading }) {
    const { id } = useParams();
    const [material, setMaterial] = useState(null);
    const [error, setError] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [inputValues, setInputValues] = useState({});

    useEffect(() => {
        fetch(`/api/materials/${id}`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch Material data');
                }
            })
            .then(data => {
                // Convert content to an array if it's a string
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
              datelist: inputValues.datelist, // Ensure this matches the server's expectations
              content: inputValues.content.join('\n'), // Ensure this is formatted correctly
          };
  
          console.log('Payload:', payload); // Log the payload to the console
  
          fetch(`/api/materials/${id}`, {
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
  
      <h1>
          {isEditable ? (
              <input
                  className='material-date'
                  name='datelist'
                  type='text'
                  value={inputValues.datelist}
                  onChange={(e) => handleInputChange('datelist', e.target.value)}
              />
          ) : (
              material.datelist
          )}
      </h1>

      <h1>Material List</h1>

      <div>
      <CopyButton textToCopy={material.content.join('\n')} />
          {isEditable ? (
            
              <textarea
                  name='content'
                  value={Array.isArray(inputValues.content) ? inputValues.content.join('\n') : inputValues.content}
                  onChange={(e) => handleInputChange('content', e.target.value.split('\n'))}
              />
          ) : (
              Array.isArray(material.content) ? material.content.map((item, index) => (
                  <p key={index}>{item}</p>
              )) : <p>{material.content}</p>
          )}
      </div>

      <button onClick={toggleEditMode}>
          {isEditable ? 'Save' : 'Edit Data'}
      </button>
    
  </div>
);
}

export default MaterialInfo;


