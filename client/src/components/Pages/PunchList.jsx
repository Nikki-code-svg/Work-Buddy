import React, { useEffect, useState } from 'react'
import NewPunchList from './NewPunchList';
import PunchListCard from './PunchListCard';
import CopyButton from '../ClipBoard';


function PunchList({jobsiteId, jobsiteName }) {

    const [ punchlist, setPunchlist ] = useState([])

    console.log(punchlist)

    useEffect(() => {
        fetch(`/api/jobsites/${jobsiteId}/punchlists`)
        .then(response => response.json())
        .then(data => setPunchlist(data))
        .catch(error => console.log('Error fetching data:', error))

    }, [jobsiteId]);
    console.log('Jobsite ID:', jobsiteId);

    const handleAddItems = (newItems) => {
        console.log('New items:', newItems);
        setPunchlist(prevItems => [newItems, ...prevItems]);

    };

    const handleDelete = (id) => {
        fetch(`/api/jobsites/${jobsiteId}/punchlists/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setPunchlist(prevItems => prevItems.filter(punchlist => punchlist.id !== id))
            } else {
                console.error('Failed to delete the punchlist item')
            };
        })
        .catch(error => console.error('Error deleting items from punchlist:', error))
    }

    const allPunchlistText = punchlist.map(punchlist => punchlist.name).join('\n');

 return (
        <main className='punchlist-container'>
            <div>
                <NewPunchList handleAddItems={handleAddItems} jobsiteId={jobsiteId} />
            </div>
            <div>
                <h2 className='punchlist-title'>Punch List for {jobsiteName} </h2>
                {punchlist.length > 0 ? (
                    <div>
                        {punchlist.map((punchlist) => 
                         <PunchListCard
                            key={punchlist.id}
                            punchlist={punchlist}
                            handleDelete={() => handleDelete(punchlist.id)}
                         />
                        
                        )}
                       
                    </div>
                ) : (
                    <p>No punchlist available</p>
                )}

            </div>
        </main>
    )
}

export default PunchList;