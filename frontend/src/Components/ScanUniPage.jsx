import React, { useRef, useState } from 'react'
import Webcam from "react-webcam";
import { Paper, Button, Title, Loader, Text } from "@mantine/core";
// import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import classes from "../css/Scanner.module.css";

function ScanUniPage() {
    const webcamRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const [validationResult, setValidationResult] = useState(null);

    // for debugging purpose
    const [image, setImage] = useState(null);
    const [resultImage, setResultImage] = useState(null);

    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
    };

    const handleSubmit = async () => {
      const formData = new FormData();
      formData.append('image', image);

      const res = await fetch('http://127.0.0.1:8000/api/scan/unif', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      
      setResultImage(`data:image/jpeg;base64,${data.image}`);
      
    };
    // ---------------------------------------



    const scanImage = async () => {
        setIsScanning(true);
        setValidationResult(null);
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (!imageSrc) {
            setIsScanning(false);
            console.error("Failed to capture image from webcam.");
            // showNotification({
            //   title: "Scan Failed",
            //   message: "Unable to capture image from webcam.",
            //   color: "red",
            //   icon: <IconX size={16} />,
            // });
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
              "http://127.0.0.1:8000/api/scan/unif",
              { method: "POST", body: formData }
            );
            const result = await response.json();
            console.log(result);
            setResultImage(`data:image/jpeg;base64,${result.image}`);
            
            if (!response.ok) {
              const errorMessage = result.error || 'Failed to process the scan';
              setValidationResult({
                success: false,
                message: errorMessage
              });
              // showNotification({
              //   title: "Scan Error",
              //   message: errorMessage,
              //   color: "red",
              //   icon: <IconX size={16} />,
              // });
              setIsScanning(false);
              return;
            }

            setValidationResult({
              success: true,
              message: `Student Uniform validated: ${result.fullName}`
            });
            // showNotification({
            //   title: "Scan Successful",
            //   message: "QR code scanned and validated successfully.",
            //   color: "green",
            //   icon: <IconCheck size={16} />,
            // });
          } catch (error) {
            console.error("Error processing image:", error);
            console.error('Scan error:', error);
            setValidationResult({
              success: false,
              message: "Network error or invalid response format"
            });
            // showNotification({
            //   title: "Scan Error",
            //   message: "Failed to communicate with the server. Please try again.",
            //   color: "red",
            //   icon: <IconX size={16} />,
            // });
          }
        }
        setIsScanning(false);
      };

  return (
    <div className={classes.scannerContainer}>
      <Title className={classes.scannerTitle} order={3}>Student Uniform Checker</Title>
      <Paper shadow="lg" radius="lg" p="xl" withBorder>
        <div className={classes.webcamContainer}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={860}
            height={600}
            videoConstraints={{
              width: 4080,
              height: 3060,
              facingMode: "user",
            }}
          />
          <div className={classes.scanOverlay} />
          <div className={`${classes.scannerCorner} ${classes.topLeft}`} />
          <div className={`${classes.scannerCorner} ${classes.topRight}`} />
          <div className={`${classes.scannerCorner} ${classes.bottomLeft}`} />
          <div className={`${classes.scannerCorner} ${classes.bottomRight}`} />
          {isScanning && (
            <div className={classes.loadingOverlay}>
              <Loader color="teal" size="lg" />
            </div>
          )}
        </div>
        {validationResult && (
          <Text className={`${classes.validationMessage} ${validationResult.success ? classes.validationSuccess : classes.validationError}`}>
            {validationResult.message}
          </Text>
        )}
        <Button
          className={classes.scanButton}
          fullWidth
          radius="md"
          size="lg"
          onClick={scanImage}
          loading={isScanning}
          color={validationResult?.success === false ? "red" : "teal"}
        >
          {isScanning ? 'Scanning...' : validationResult?.success === false ? 'Try Again' : 'Scan Uniform'}
        </Button>
      </Paper>

      {/* for debugging purpose */}
        <div>
        <h2>Upload Image for Uniform Detection</h2>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleSubmit}>Submit</button>
        <div className="w-[200px] h-[200px]">
        {resultImage && (
          <div>
            <h3>Detection Result</h3>
            <img
              src={resultImage}
              alt="Detected Frame"
              className="w-[200px] h-[200px] object-contain rounded bg-gray-100"
            />
          </div>
        )}
        </div>
      </div>
    </div>

  )
}

export default ScanUniPage;