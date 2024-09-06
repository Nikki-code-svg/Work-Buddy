import React,{useState} from "react";

function NewPunchList({ handleAddItems, jobsiteId }) {

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
    
        fetch(`/api/jobsites/${jobsiteId}/punchlists`, {
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
                <h1 className="create-punch-title">Create New Punch List</h1>
                {errors.length > 0 && (
                    <div className="error-messages">
                        {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="new-form-group">
                        <label 
                           className="label-item-p"
                           htmlFor="name">Item:</label>
                        <input
                            className="punch-input"
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                   <button className="punchbtn" type="submit">
                        {isLoading ? 'Adding...' : 'Add Items'}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default NewPunchList;