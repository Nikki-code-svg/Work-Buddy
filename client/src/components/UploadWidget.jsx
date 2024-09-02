
import { useEffect, useRef } from 'react';

const UploadWidget = () => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;

        if (cloudinaryRef.current) {
            widgetRef.current = cloudinaryRef.current.createUploadWidget({
                cloudName: 'dhncrfnsz',
                uploadPreset: 'mlzphbuh'
            }, function(error, result) {
                console.log(result);
            });
        } else {
            console.error('Cloudinary script not loaded');
        }

    }, []);

    return (
        <button onClick={() => widgetRef.current.open()}>
            Upload
        </button>
    );
}

export default UploadWidget;
