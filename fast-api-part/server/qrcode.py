import base64
from io import BytesIO
import qrcode
import dotenv
import os
dotenv.load_dotenv()


def make_base64_qr_code(data):
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=4,
        border=4,
    )

    url = os.getenv('SERVER_DOMAIN') + f"/{data['code']}?owner_id={data['owner_id']}"
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image()

    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue())
    return img_str
