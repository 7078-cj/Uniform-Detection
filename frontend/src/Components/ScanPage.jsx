import React, { useRef, useState } from 'react'
import Webcam from "react-webcam";
import { Paper, Button, Title, Loader, Text } from "@mantine/core";
// import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import classes from "../css/Scanner.module.css";

function ScanPage() {
    const webcamRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const [validationResult, setValidationResult] = useState(null);

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
              "http://127.0.0.1:8000/api/scan/qr",
              { method: "POST", body: formData }
            );
            const result = await response.json();
            console.log(result);
            
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
              message: `Student ID validated: ${result.fullName}`
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
      <Title className={classes.scannerTitle} order={3}>Student ID Scanner</Title>
      <Paper shadow="lg" radius="lg" p="xl" withBorder>
        <div className={classes.webcamContainer}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={560}
            height={400}
            videoConstraints={{
              width: 560,
              height: 400,
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
          {isScanning ? 'Scanning...' : validationResult?.success === false ? 'Try Again' : 'Scan ID'}
        </Button>
      </Paper>
    </div>

  )
}

export default ScanPage;