from pypdf import PdfReader
from PIL import Image
import pytesseract

file_path = r"D:\HIMANSHU\Desktop\RD\Project-8 Invoice Data Parser\backend\data\batch1_1\batch1-0001.jpg"

def extract_text(file_path):

    if file_path.lower().endswith('.pdf'):
        reader = PdfReader(file_path)

        full_text = ""

        for text in reader.pages:
            full_text += text.extract_text() or ""

        return full_text

    elif file_path.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".tiff")):
        img = Image.open(file_path)

        return pytesseract.image_to_string(img)

    else :
        return "Unsupported file type. Only PDF and image files are allowed."

# answer = extract_text(file_path)
# print(answer)

# NOTE : We need to handle scanned PDFs with OCR because pypdf only works properly when the PDF contains selectable text.