// import React, { useState, useEffect } from "react";
// import CopyButton from "../ClipBoard";

// function PunchListCard({ punchlist, handleDelete }) {
//     const [isChecked, setIsChecked] = useState(false);
//     const [showDelete, setShowDelete] = useState(false);

//     // Load the initial state from localStorage when the component mounts
//     useEffect(() => {
//         const savedState = localStorage.getItem(`punchlist-${punchlist.id}-checked`);
//         if (savedState === "true") {
//             setIsChecked(true);
//             setShowDelete(true); // Ensure the delete button is shown if previously checked
//         }
//     }, [punchlist.id]);

//     const handleCheckboxChange = () => {
//         const newCheckedState = !isChecked;
//         setIsChecked(newCheckedState);
//         setShowDelete(newCheckedState);

//         // Save the new state to localStorage
//         localStorage.setItem(`punchlist-${punchlist.id}-checked`, newCheckedState);
//     };

//     return (
//         <div className="punchlist-card">
//             <input 
//                 className="checkbox"
//                 type="checkbox" 
//                 checked={isChecked}
//                 onChange={handleCheckboxChange}
//                 style={{ marginRight: '10px' }}
//             />
//             {punchlist.name}
//             {showDelete && (
//                 <button
//                     className="punchbtn-delete"
//                     onClick={() => handleDelete(punchlist.id)}
//                 >
//                     Delete
//                 </button>
//             )}
//            <CopyButton className='copybtn-punch' textToCopy={`${punchlist.name}, Checked: ${isChecked ? "Yes" : "No"}`} />
//         </div>
//     );
// }

// export default PunchListCard;
import React, { useState, useEffect } from "react";
import CopyButton from "../ClipBoard";

function PunchListCard({ punchlist, handleDelete }) {
    const [isChecked, setIsChecked] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    // Load the initial state from localStorage when the component mounts
    useEffect(() => {
        const savedState = localStorage.getItem(`punchlist-${punchlist.id}-checked`);
        if (savedState !== null) {
            setIsChecked(savedState === "true"); // Parse the saved state
            setShowDelete(savedState === "true"); // Ensure the delete button is shown if previously checked
        } else {
            setIsChecked(false); // Default to unchecked if no saved state
            setShowDelete(false); // Default to hiding delete button
        }
    }, [punchlist.id]);

    const handleCheckboxChange = () => {
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);
        setShowDelete(newCheckedState);

        // Save the new state to localStorage
        localStorage.setItem(`punchlist-${punchlist.id}-checked`, newCheckedState);
    };

    return (
        <div className="punchlist-card">
            <input 
                className="checkbox"
                type="checkbox" 
                checked={isChecked}
                onChange={handleCheckboxChange}
                style={{ marginRight: '10px' }}
            />
            {punchlist.name}
            {showDelete && (
                <button
                    className="punchbtn-delete"
                    onClick={() => handleDelete(punchlist.id)}
                >
                    Delete
                </button>
            )}
            <CopyButton className='copybtn-punch' textToCopy={`${punchlist.name}, Checked: ${isChecked ? "Yes" : "No"}`} />
        </div>
    );
}

export default PunchListCard;



