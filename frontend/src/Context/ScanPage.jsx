import React, { useRef } from 'react'
import Webcam from "react-webcam";

function ScanPage() {
    const webcamRef = useRef(null);

    const scanImage = async () => {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (!imageSrc) {
            console.error("Failed to capture image from webcam.");
            return;
          }
    
          const byteCharacters = atob(imageSrc.split(",")[1]);
          const byteNumbers = Array.from(byteCharacters, (char) =>
            char.charCodeAt(0)
          );
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/png" });
    
          const formData = new FormData();
          formData.append("image", blob, "snapshot.png");
    
          try {
            const response = await fetch(
              "http://127.0.0.1:8000/api/scan/",
              { method: "POST", body: formData }
            );
            const result = await response.json();
            console.log(result);
          } catch (error) {
            console.error("Error processing image:", error);
          }
        }
      };

  return (
    <div>
        <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width={380}
                      height={260}
                      videoConstraints={{
                        width: 380,
                        height: 260,
                        facingMode: "user",
                      }}
                    />

        <button onClick={scanImage} className='w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2'>Scan</button>
    </div>
  )
}

export default ScanPage