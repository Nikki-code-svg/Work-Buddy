import React,{useState} from "react";

function NewPunchList({ handleAddItems }) {

    const [form, setForm] = useState({
        name: ''
        
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);

  

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
    
        fetch('/api/punchlists', {
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
        .then(NewPunchList => {
            handleAddItems(NewPunchList);
            setIsLoading(false);
            setForm({ name: '' });
           
        })
        .catch(error => {
            setIsLoading(false);
            setErrors([error.message]);
        });
    }
    
   

    return (
        <div>
            <div className="create-punchlist-wrapper">
                <h1>Create New Punch List</h1>
                {errors.length > 0 && (
                    <div className="error-messages">
                        {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="new-form-group">
                        <label htmlFor="name">Item:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
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
export default NewPunchList;