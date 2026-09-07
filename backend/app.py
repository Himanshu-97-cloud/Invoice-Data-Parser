from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import shutil
import os

from fastapi.middleware.cors import CORSMiddleware
from backend.main import process_invoice


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "Invoice Parser API is running"}


@app.post("/process-invoice")
async def process_invoice_file(
    invoice_file: UploadFile = File(...),
    excel_file: UploadFile | None = File(default=None)
):

    # Save invoice
    invoice_path = os.path.join(
        UPLOAD_FOLDER,
        invoice_file.filename
    )

    with open(invoice_path, "wb") as buffer:
        shutil.copyfileobj(invoice_file.file, buffer)

    # Existing Excel or new Excel
    if excel_file:

        excel_path = os.path.join(
            OUTPUT_FOLDER,
            excel_file.filename
        )

        with open(excel_path, "wb") as buffer:
            shutil.copyfileobj(excel_file.file, buffer)

    else:

        excel_path = os.path.join(
            OUTPUT_FOLDER,
            "invoices.xlsx"
        )

    # Process
    output_file = process_invoice(
        invoice_path,
        excel_path
    )

    # Return Excel as downloadable file
    return FileResponse(
        path=output_file,
        filename=os.path.basename(output_file),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )