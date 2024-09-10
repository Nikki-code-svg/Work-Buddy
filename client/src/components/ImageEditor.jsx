// import React, { useRef, useState } from 'react';



// const ImageEditor = () => {
//     const canvasRef = useRef(null);
//     const [image, setImage] = useState(null);
//     const [editing, setEditing] = useState(false);
//     const [painting, setPainting] = useState(false);
//     const [cropping, setCropping] = useState(false);
//     const [startX, setStartX] = useState(0);
//     const [startY, setStartY] = useState(0);
//     const [endX, setEndX] = useState(0);
//     const [endY, setEndY] = useState(0);

//     // Load an image from the user's device
//     const loadImage = (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             const img = new Image();
//             img.src = event.target.result;
//             img.onload = () => {
//                 const canvas = canvasRef.current;
//                 const ctx = canvas.getContext('2d');
//                 canvas.width = img.width;
//                 canvas.height = img.height;
//                 ctx.drawImage(img, 0, 0);
//                 setImage(img);
//             };
//         };
//         reader.readAsDataURL(file);
//     };

//     // Drawing on the image
//     const startPosition = (e) => {
//         setPainting(true);
//         draw(e);
//     };

//     const finishedPosition = () => {
//         setPainting(false);
//         const ctx = canvasRef.current.getContext('2d');
//         ctx.beginPath();
//     };

//     const draw = (e) => {
//         if (!painting) return;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         ctx.lineWidth = 5;
//         ctx.lineCap = 'round';
//         ctx.strokeStyle = 'red';

//         ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         ctx.stroke();
//         ctx.beginPath();
//         ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     };

//     // Cropping the image
//     const startCrop = (e) => {
//         setCropping(true);
//         setStartX(e.nativeEvent.offsetX);
//         setStartY(e.nativeEvent.offsetY);
//     };

//     const finishCrop = (e) => {
//         setCropping(false);
//         setEndX(e.nativeEvent.offsetX);
//         setEndY(e.nativeEvent.offsetY);
//         cropImage();
//     };

//     const cropImage = () => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         const cropWidth = endX - startX;
//         const cropHeight = endY - startY;
//         const croppedImage = ctx.getImageData(startX, startY, cropWidth, cropHeight);
//         canvas.width = cropWidth;
//         canvas.height = cropHeight;
//         ctx.putImageData(croppedImage, 0, 0);
//     };

//     // Save the edited image
//     const saveImage = () => {
//         const canvas = canvasRef.current;
//         const imageData = canvas.toDataURL('image/png');
//         setImage(imageData);
//         setEditing(false);
//     };

//     return (
//         <div className="card">
//             <div className="image-container">
//                 <canvas
//                     ref={canvasRef}
//                     onMouseDown={cropping ? startCrop : startPosition}
//                     onMouseUp={cropping ? finishCrop : finishedPosition}
//                     onMouseMove={draw}
//                     style={{ border: '1px solid #000', width: '100%', height: 'auto' }}
//                 ></canvas>
//                 <button onClick={() => setEditing(true)} style={{ marginTop: '10px' }}>
//                     Edit Image
//                 </button>
//                 {editing && (
//                     <>
//                         <input type="file" accept="image/*" onChange={loadImage} style={{ display: 'block', marginTop: '10px' }} />
//                         <button onClick={saveImage} style={{ marginTop: '10px' }}>
//                             Save Changes
//                         </button>
//                     </>
//                 )}
//             </div>
//             <div className="text-area">
//                 <textarea rows="10" cols="30" placeholder="Enter text here..."></textarea>
//             </div>
//         </div>
//     );
// };

// export default ImageEditor;
