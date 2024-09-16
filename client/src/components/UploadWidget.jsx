import React, { useRef, useEffect, useState } from 'react';

const UploadWidget = ({ setImageUrls }) => {
    const cloudName = import.meta.env.cloud_name;
    const uploadPreset = import.meta.env.upload_preset;
    

    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    const [localUrls, setLocalUrls] = useState([]);

    useEffect(() => {
        console.log('Cloudinary Cloud Name:', cloudName);
        console.log('Cloudinary Upload Preset:', uploadPreset);
        // Function to handle the script load
        const handleScriptLoad = () => {
            if (window.cloudinary) {
                cloudinaryRef.current = window.cloudinary;
                widgetRef.current = cloudinaryRef.current.createUploadWidget({
                    cloudName: 'dhncrfnsz',
                    uploadPreset: 'mlzphbuh',
                    multiple: true,
                }, (error, result) => {
                    if (error) {
                        console.error('Error during upload:', error);
                        return;
                    }
                    if (result.event === 'success') {
                        const url = result.info.secure_url;
                        console.log('Uploaded image URL:', url);
                        setLocalUrls((prev) => [...prev, url]);
                        setImageUrls((prev) => [...prev, url]);
                    }
                });
            } else {
                console.error('Cloudinary script not loaded');
            }
        };

        // Check if Cloudinary script is already present
        if (window.cloudinary) {
            handleScriptLoad();
        } else {
            // Load the Cloudinary script if not present
            const script = document.createElement('script');
            script.src = 'https://upload-widget.cloudinary.com/latest/global/all.js';
            script.onload = handleScriptLoad;
            script.defer = true;
            document.body.appendChild(script);

            // Cleanup script when component unmounts
            return () => {
                document.body.removeChild(script);
            };
        }
    }, [cloudName, uploadPreset, setImageUrls]);

    return (
        <div>
            <button className='uploadprintbtn' onClick={() => widgetRef.current.open()}>Upload Images</button>
            <div>
                {localUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Uploaded ${index}`} width="100" />
                ))}
            </div>
        </div>
    );
};

export default UploadWidget;








