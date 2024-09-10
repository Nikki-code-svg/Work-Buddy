import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewImage({ handleAddImages, jobsiteId }) {
    const [form, setForm] = useState({
        location: '',
        note: '',
        url: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
    
        fetch(`/api/jobsites/${jobsiteId}/images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text); });
            }
            return res.json();
        })
        .then(newImage => {
            handleAddImages(newImage);
            setIsLoading(false);
            setForm({ location: '', note: '', url: '' });
            navigate(`/images/${newImage.id}`);
        })
        .catch(error => {
            setIsLoading(false);
            setErrors([error.message]);
        });
    }
    
    return (
        <div>
            <div className="create-image-wrapper">
                <h1 className='create-new-title'>Create New Image</h1>
                {errors.length > 0 && (
                    <div className="error-messages">
                        {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="new-form-group">
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="new-form-group">
                        <label htmlFor="url">Image URL:</label>
                        <input
                            type="text"
                            id="url"
                            name="url"
                            value={form.url}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="new-form-group">
                        <label htmlFor="note">Note:</label>
                        <textarea
                            className='textarea-note'
                            id="note"
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            rows="4"
                            cols="50"
                            placeholder="Enter notes"
                            required
                        />
                    </div>
                    <button type="submit">
                        {isLoading ? 'Adding...' : 'Add Image'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewImage;

