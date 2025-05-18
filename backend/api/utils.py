import qrcode
import qrcode.constants
import cv2
from io import BytesIO
from django.core.files import File
import numpy as np
from ultralytics import YOLO
import os



def generate_and_save_qr_to_model(data, instance):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)

    instance.qr_code.save(f"{data}.png", File(buffer), save=False)
    
    
def qr_scanner(img_file):
    # Convert Django's InMemoryUploadedFile to a format OpenCV can read
    img_array = np.frombuffer(img_file.read(), np.uint8)
    image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    
    if image is None:
        return None
    
    qr_det = cv2.QRCodeDetector()
    decoded, _, _ = qr_det.detectAndDecode(image)
    
    return decoded

def uniform_scanner(img_file):
    import os
    import cv2
    import numpy as np
    from ultralytics import YOLO

   
    img_array = np.frombuffer(img_file.read(), np.uint8)
    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    if frame is None:
        print("Failed to load image.")
        return None

    
    model_path = os.path.join(os.path.dirname(__file__), "UniformDetectionModelV3.pt")
    model = YOLO(model_path)

    
    results = model(frame)[0]

    print(results)
    detected_objects = []
    
    for box in results.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        conf = float(box.conf[0])
        cls = int(box.cls[0])
        label = f'{model.names[cls]} {conf:.2f}'
        
        detected_objects.append({
            "bbox": [x1, y1, x2, y2],
            "confidence": conf,
            "class_id": cls,
            "label": label,
        })

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, label, (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    return frame, detected_objects 

    