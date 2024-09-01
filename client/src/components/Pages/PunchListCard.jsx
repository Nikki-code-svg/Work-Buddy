import React, { useState } from "react";


function PunchListCard({ punchlist, handleDelete }) {
    const [showDelete, setShowDelete] = useState(false);

    const handleCheckboxChange = (event) => {
        setShowDelete(event.target.checked);
    };



    return (
        <div className="punchlist-card">
            <input 
                type="checkbox" 
                checked={showDelete}
                onChange={handleCheckboxChange}
                style={{ marginRight: '10px' }}
            />
            {punchlist.name}
            {showDelete && (
                <button
                    onClick={() => handleDelete(punchlist.id)}
                >
                    Delete
                </button>
                 
            )}
           
        </div>
    );
}

export default PunchListCard;

