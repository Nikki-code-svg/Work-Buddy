// import { useEffect, useRef } from 'react';


// let MyGallery = () => {
//     const containerRef = useRef(null);
//     useEffect(() => {
//         if (window && containerRef.current) {
//             console.log(window.cloudinary);
//             console.log(typeof window.cloudinary.gallerywidget);
  
//             window.cloudinary
//                 .gallerywidget({
//                     container: containerRef.current,
//                     cloudName: 'dhncrfnsz',
//                     mediaAssets: [
//                         { tag: 'gallery-images' },
//                         { tag: 'gallery-videos', mediaType: 'video' },
//                     ],
//                     carouselStyles: 'indicators',
//                     carouselLocation: 'bottom',
//                 })
//                 .render();
//         } else {
//             console.error('Cloudinary gallerywidget function not found.');
//         }
//     }, []);
    
//     return (
//         <div  ref={containerRef } style={{ width: '1200px', margin: 'auto'}} />
        
//     )
// }

// export default MyGallery;

