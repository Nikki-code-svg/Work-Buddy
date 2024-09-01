import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewMaterial({ handleAddMaterial }) {
    const [form, setForm] = useState({
        datelist: '',
        content: ''
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
    
        fetch('/api/materials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form), // Sending form data directly without modifications
        })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text); });
            }
            return res.json();
        })
        .then(newMaterial => {
            handleAddMaterial(newMaterial);
            setIsLoading(false);
            setForm({ datelist: '', content: '' });
            navigate(`/materials/${newMaterial.id}`);
        })
        .catch(error => {
            setIsLoading(false);
            setErrors([error.message]);
        });
    }
    
   

    return (
        <div>
            <div className="create-material-wrapper">
                <h1>Create New Material List</h1>
                {errors.length > 0 && (
                    <div className="error-messages">
                        {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="new-form-group">
                        <label htmlFor="datelist">Date:</label>
                        <input
                            type="text"
                            id="datelist"
                            name="datelist"
                            value={form.datelist}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="new-form-group">
                        <label htmlFor="content">List:</label>
                        <textarea
                            id="content"
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            rows="6"  // Increased rows to show more content
                            cols="50"
                            placeholder="Enter items, each on a new line"
                            required
                        />
                    </div>
                    <button type="submit">
                        {isLoading ? 'Adding...' : 'Add Materials'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewMaterial;



