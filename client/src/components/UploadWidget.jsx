import React, { useRef, useEffect, useState } from 'react';

const UploadWidget = ({ setImageUrls }) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    const [localUrls, setLocalUrls] = useState([]);

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        if (cloudinaryRef.current) {
            widgetRef.current = cloudinaryRef.current.createUploadWidget({
                cloudName:  'dhncrfnsz',
                uploadPreset: 'mlzphbuh',
                multiple: true,
            }, (error, result) => {
                if (result.event === 'success') {
                    const url = result.info.secure_url;
                    setLocalUrls((prev) => [...prev, url]);
                    setImageUrls((prev) => [...prev, url]);
                }
            });
        }
    }, [setImageUrls]);

    return (
        <div>
            <button onClick={() => widgetRef.current.open()}>Upload Images</button>
            <div>
                {localUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Uploaded ${index}`} width="100" />
                ))}
            </div>
        </div>
    );
};

export default UploadWidget;








