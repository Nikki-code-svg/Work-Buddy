import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewJob({ handleAddJobsite}) {
    const [form, setForm] = useState({
        name: '',
        location: '',
        startdate: '',
        enddate: '',
        note: '',
       
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
    
        fetch('/api/jobsites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        })
          .then(res => {
            setIsLoading(false);
            if (res.ok) {
              return res.json();
            } else {
              return res.json().then(err => {
                setErrors(err.errors || ['Failed to add Jobsite']);
                throw new Error('Failed to add Jobsite');
              });
            }
          })
          .then(newjobsite => {
            handleAddJobsite(newjobsite); 
            navigate('/jobsites');
          })
          .catch(error => {
            setIsLoading(false);
            setErrors(['Something went wrong! Please try again.']);
          });
      }
    
      return (
        <div>
          <div className='create-jobsite-wrapper'>
            <h1>Create Jobsite</h1>
            {errors.length > 0 && (
              <div className='error-messages'>
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            <form onSubmit={handleSubmit}>
             
              <div className='new-form-group'>
                <label htmlFor='name'>Name:</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className='new-form-group'>
                <label htmlFor='location'>Location:</label>
                <input
                  type='text'
                  id='location'
                  name='location'
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='new-form-group'>
                <label htmlFor='startdate'>Start Date:</label>
                <input
                  type='text'
                  id='startdate'
                  name='startdate'
                  value={form.startdate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='new-form-group'>
                <label htmlFor='enddate'>End Date:</label>
                <input
                  type='text'
                  id='enddate'
                  name='enddate'
                  value={form.enddate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='new-form-group'>
                <label htmlFor='note'>Type of Work:</label>
                <input
                  type='text'
                  id='note'
                  name='note'
                  value={form.note}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type='submit'>
                {isLoading ? 'Adding...' : 'Add Jobsite'}
              </button>
            </form>
          </div>
        </div>
      );
    }
    
  
export default NewJob;