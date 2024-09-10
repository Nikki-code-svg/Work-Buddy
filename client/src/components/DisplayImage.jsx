import React, { useState, useEffect } from 'react';
import { Image } from 'cloudinary-react';

const API_URL = 'http://localhost:5555';

function DisplayImage({ jobsiteId }) {  
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submittedImages, setSubmittedImages] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchPrints = async () => {
        try {
            const response = await fetch(`/api/jobsites/${jobsiteId}/prints`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPrints(data);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching prints:', error);
        }
    };

    fetchPrints();
}, [jobsiteId]);


  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!image) {
      setMessage('Please upload an image.');
      return;
    }

    const fileSizeMB = image.size / 1024 / 1024;
    if (fileSizeMB > 50) {
      setMessage('File size exceeds the 50MB limit.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const uploadResponse = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image.');
      }

      const uploadResult = await uploadResponse.json();
      setMessage('Image uploaded successfully!');
      displayImageDetails(uploadResult.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image.');
      setLoading(false);
    }
  }

  function displayImageDetails(imageUrl) {
    const imageData = {
      jobsite_id: jobsiteId,  // Use the passed jobsiteId
      url: imageUrl,
    };

    fetch(`${API_URL}/api/prints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage('Image submitted successfully!');
          setSubmittedImages((prev) => [...prev, { url: imageUrl, jobsite_id: jobsiteId }]);
          setImage(null);
          setImagePreview('');
        } else {
          setMessage('Failed to submit image.');
        }
      })
      .catch((error) => {
        console.error('Error submitting image:', error);
        setMessage('Error submitting image.');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Upload image:
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </label>
        </div>

        {imagePreview && (
          <div>
            <h3>Image Preview:</h3>
            <img src={imagePreview} alt="Preview" width="300" />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Image'}
        </button>
      </form>

      {message && <p>{message}</p>}

      {submittedImages.length > 0 && (
        <div className="submitted-images">
          <h3>Submitted Images for Jobsite {jobsiteId}</h3>
          <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            {submittedImages.map((print, index) => (
              <div key={index}>
                <img src={print.url} alt={`Uploaded ${index}`} width="300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayImage;


     