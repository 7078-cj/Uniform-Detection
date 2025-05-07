import qrcode
import qrcode.constants
import cv2
from io import BytesIO
from django.core.files import File
import numpy as np



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