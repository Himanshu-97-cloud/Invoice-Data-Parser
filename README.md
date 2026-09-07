<p align="center">
  <img src="frontend/src/assets/image.png" alt="Invoice Data Parser Banner" width="100%">
</p>


## Introduction

**Invoice Data Parser** is an AI-powered application that extracts important information from invoices and converts it into a structured Excel file.

The application accepts **PDF or image invoices**, extracts the text using PDF parsing or OCR, uses a local **Qwen LLM through Ollama** to understand and structure the invoice data, and finally stores the results in Excel.

It can also append new invoice data to an existing Excel file.

### Workflow

```text
Invoice (PDF / Image)
        ↓
Text Extraction / OCR
        ↓
Qwen LLM via Ollama
        ↓
Structured Invoice Data
        ↓
Excel Spreadsheet
```

---

## Features

* 📄 Supports PDF and image invoices
* 🔍 OCR for scanned/image invoices
* 🤖 AI-powered invoice data extraction
* 🧾 Extracts invoice and line-item details
* 📑 Supports multiple invoices in a PDF
* 📊 Creates structured Excel spreadsheets
* ➕ Can append data to an existing Excel file
* 🌐 React-based user interface
* ⚡ FastAPI backend
* 🏠 Runs locally without external AI APIs

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Lucide React

### Backend

* Python
* FastAPI
* Uvicorn

### AI & Processing

* Ollama
* Qwen 2.5 7B
* PyPDF
* Tesseract OCR
* Pytesseract
* Pillow

### Excel

* OpenPyXL

---

## Project Structure

```text
Invoice-Data-Parser/
│
├── backend/
│   ├── app.py
│   ├── main.py
│   ├── text_extractor.py
│   ├── llm_parser.py
│   └── excel_handler.py
│
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
├── assets/
│   └── banner.png
│
├── README.md
└── .gitignore
```

---

# Run Locally

## 1. Clone the Repository

```bash
git clone https://github.com/Himanshu-97-cloud/Invoice-Data-Parser.git
cd Invoice-Data-Parser
```

---

## 2. Backend Setup

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it.

### Windows

```bash
venv\Scripts\activate
```

Install the required packages:

```bash
pip install -r backend/requirements.txt
```

---

## 3. Install Tesseract OCR

Install **Tesseract OCR** on your computer.

Make sure the Tesseract executable is available to the application.

---

## 4. Install Ollama

Install Ollama and download the Qwen model:

```bash
ollama pull qwen2.5:7b
```

Make sure Ollama is running before processing invoices.

---

## 5. Start the Backend

From the project root:

```bash
uvicorn backend.app:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

---

## 6. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

---

# How to Use

1. Open the React application.
2. Upload an invoice in **PDF or image format**.
3. Optionally upload an existing `.xlsx` file.
4. Click **Process Invoice**.
5. The backend extracts the invoice text.
6. Qwen analyzes and structures the invoice data.
7. The application creates or updates the Excel file.
8. Download the generated Excel spreadsheet.

---

## Excel Output

The generated workbook contains two sheets:

### Invoices

Contains information such as:

* Invoice Number
* Date
* Seller
* Seller Address
* Seller Tax ID
* Client
* Client Address
* Client Tax ID
* Net Total
* VAT
* Gross Total

### Items

Contains:

* Invoice Number
* Item Number
* Description
* Quantity
* Unit
* Net Price
* Net Worth
* VAT %
* Gross Worth

---

## Troubleshooting

### Ollama connection error

Make sure Ollama is running and the model is installed:

```bash
ollama list
```

If Qwen is missing:

```bash
ollama pull qwen2.5:7b
```

### Tesseract not found

Make sure Tesseract OCR is installed and its executable path is correctly configured.

### Frontend cannot connect to backend

Make sure the FastAPI server is running:

```bash
uvicorn backend.app:app --reload
```

Also verify that the frontend is using:

```text
http://127.0.0.1:8000
```

---

## Conclusion

Invoice Data Parser automates the process of extracting information from invoices and organizing it into usable Excel spreadsheets.

It combines **OCR, PDF extraction, local LLM processing, FastAPI, React, and Excel automation** into one complete application.

The project is designed to run locally and can be extended with additional invoice formats, validation, database storage, authentication, and cloud deployment in the future.
