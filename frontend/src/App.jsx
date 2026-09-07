import { useRef, useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  Upload,
  X,
  Download,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function App() {
  const invoiceInputRef = useRef(null);
  const excelInputRef = useRef(null);

  const [invoiceFile, setInvoiceFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);

  const [invoiceDragging, setInvoiceDragging] = useState(false);
  const [excelDragging, setExcelDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState("invoices.xlsx");

  const invoiceExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".bmp", ".tiff"];
  const excelExtensions = [".xlsx", ".xls"];

  const validateFile = (file, type) => {
    if (!file) {
      return false;
    }

    const fileName = file.name.toLowerCase();

    if (type === "invoice") {
      return invoiceExtensions.some((extension) =>
        fileName.endsWith(extension)
      );
    }

    if (type === "excel") {
      return excelExtensions.some((extension) =>
        fileName.endsWith(extension)
      );
    }

    return false;
  };

  const handleInvoiceFile = (file) => {
    setError("");
    setSuccess(false);
    setDownloadUrl(null);

    if (!file) {
      return;
    }

    if (!validateFile(file, "invoice")) {
      setError("Please upload a PDF or image invoice.");
      return;
    }

    setInvoiceFile(file);
  };

  const handleExcelFile = (file) => {
    setError("");
    setSuccess(false);
    setDownloadUrl(null);

    if (!file) {
      return;
    }

    if (!validateFile(file, "excel")) {
      setError("Please upload a valid Excel file (.xlsx or .xls).");
      return;
    }

    setExcelFile(file);
  };

  const handleInvoiceInput = (event) => {
    handleInvoiceFile(event.target.files[0]);
  };

  const handleExcelInput = (event) => {
    handleExcelFile(event.target.files[0]);
  };

  const handleInvoiceDrop = (event) => {
    event.preventDefault();
    setInvoiceDragging(false);

    const file = event.dataTransfer.files[0];
    handleInvoiceFile(file);
  };

  const handleExcelDrop = (event) => {
    event.preventDefault();
    setExcelDragging(false);

    const file = event.dataTransfer.files[0];
    handleExcelFile(file);
  };

  const removeInvoiceFile = () => {
    setInvoiceFile(null);

    if (invoiceInputRef.current) {
      invoiceInputRef.current.value = "";
    }
  };

  const removeExcelFile = () => {
    setExcelFile(null);

    if (excelInputRef.current) {
      excelInputRef.current.value = "";
    }
  };

  const processInvoice = async () => {
    if (!invoiceFile) {
      setError("Please upload an invoice first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);
    setDownloadUrl(null);

    try {
      const formData = new FormData();

      formData.append("invoice_file", invoiceFile);

      if (excelFile) {
        formData.append("excel_file", excelFile);
      }

      setLoadingStep("Uploading your invoice...");

      await new Promise((resolve) => setTimeout(resolve, 500));

      setLoadingStep("Reading invoice and extracting text...");

      const responsePromise = fetch(`${API_URL}/process-invoice`, {
        method: "POST",
        body: formData,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLoadingStep("AI is extracting invoice details...");

      const response = await responsePromise;

      if (!response.ok) {
        let message = "Something went wrong while processing the invoice.";

        try {
          const errorData = await response.json();

          if (errorData?.detail) {
            if (typeof errorData.detail === "string") {
              message = errorData.detail;
            } else {
              message = "The server could not process the uploaded files.";
            }
          }
        } catch {
          // Keep default error message
        }

        throw new Error(message);
      }

      setLoadingStep("Creating your Excel spreadsheet...");

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      setDownloadUrl(url);
      setDownloadName(
        excelFile ? excelFile.name : "invoices.xlsx"
      );

      setLoadingStep("Completed");
      setSuccess(true);

    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the invoice processing server."
      );
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const resetAll = () => {
    setInvoiceFile(null);
    setExcelFile(null);
    setLoading(false);
    setLoadingStep("");
    setError("");
    setSuccess(false);

    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl);
    }

    setDownloadUrl(null);

    if (invoiceInputRef.current) {
      invoiceInputRef.current.value = "";
    }

    if (excelInputRef.current) {
      excelInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
              <FileText className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Invoice Parser
              </h1>

              <p className="text-xs text-slate-500">
                AI-powered invoice extraction
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 sm:flex">
            <Sparkles className="h-4 w-4" />
            AI Extraction
          </div>

        </div>
      </header>


      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-12">

        {/* Hero */}
        <section className="mb-10 text-center">

          <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Invoice → Structured Excel
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Turn invoices into
            <span className="block text-slate-500">
              organized spreadsheets.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500">
            Upload an invoice and let AI extract the details automatically.
            You can also provide an existing Excel file to append the new
            invoice data.
          </p>

        </section>


        {/* Upload area */}
        <section className="grid gap-6 md:grid-cols-2">

          {/* Invoice Upload */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-start justify-between">

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-700" />

                  <h3 className="font-semibold text-slate-900">
                    Invoice
                  </h3>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    Required
                  </span>
                </div>

                <p className="text-sm text-slate-500">
                  PDF or image file
                </p>
              </div>

            </div>


            {!invoiceFile ? (

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setInvoiceDragging(true);
                }}
                onDragLeave={() => setInvoiceDragging(false)}
                onDrop={handleInvoiceDrop}
                onClick={() => invoiceInputRef.current?.click()}
                className={`flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 text-center transition ${
                  invoiceDragging
                    ? "border-slate-900 bg-slate-100"
                    : "border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
                }`}
              >

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                  <Upload className="h-6 w-6 text-slate-600" />
                </div>

                <p className="font-medium text-slate-800">
                  Drop your invoice here
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  or click to browse
                </p>

                <p className="mt-4 text-xs text-slate-400">
                  PDF, JPG, JPEG, PNG, BMP, TIFF
                </p>

                <input
                  ref={invoiceInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff"
                  onChange={handleInvoiceInput}
                  className="hidden"
                />

              </div>

            ) : (

              <FileCard
                file={invoiceFile}
                type="invoice"
                onRemove={removeInvoiceFile}
              />

            )}

          </div>


          {/* Excel Upload */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-start justify-between">

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-slate-700" />

                  <h3 className="font-semibold text-slate-900">
                    Existing Excel
                  </h3>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    Optional
                  </span>
                </div>

                <p className="text-sm text-slate-500">
                  Append data to an existing spreadsheet
                </p>
              </div>

            </div>


            {!excelFile ? (

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setExcelDragging(true);
                }}
                onDragLeave={() => setExcelDragging(false)}
                onDrop={handleExcelDrop}
                onClick={() => excelInputRef.current?.click()}
                className={`flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 text-center transition ${
                  excelDragging
                    ? "border-slate-900 bg-slate-100"
                    : "border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
                }`}
              >

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                  <FileSpreadsheet className="h-6 w-6 text-slate-600" />
                </div>

                <p className="font-medium text-slate-800">
                  Drop Excel file here
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  or click to browse
                </p>

                <p className="mt-4 text-xs text-slate-400">
                  .XLSX or .XLS
                </p>

                <input
                  ref={excelInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelInput}
                  className="hidden"
                />

              </div>

            ) : (

              <FileCard
                file={excelFile}
                type="excel"
                onRemove={removeExcelFile}
              />

            )}

          </div>

        </section>


        {/* Info */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-4">

          <div className="flex gap-3">

            <div className="mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-800">
                How it works
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                The invoice is read using text extraction/OCR, AI identifies
                the invoice fields and line items, and the result is organized
                into an Excel spreadsheet.
              </p>
            </div>

          </div>

        </div>


        {/* Error */}
        {error && (

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">

            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="font-medium text-red-800">
                Processing failed
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>

          </div>

        )}


        {/* Loading */}
        {loading && (

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100">

                <LoaderCircle className="h-6 w-6 animate-spin text-slate-700" />

              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <p className="font-semibold text-slate-900">
                    Processing invoice
                  </p>

                  <span className="text-xs font-medium text-slate-400">
                    Please wait
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {loadingStep}
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-slate-800" />
                </div>

              </div>

            </div>

          </div>

        )}


        {/* Success */}
        {success && downloadUrl && (

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">

                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                </div>

                <div>
                  <p className="font-semibold text-emerald-900">
                    Your Excel file is ready
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    Invoice data has been successfully processed.
                  </p>
                </div>

              </div>


              <a
                href={downloadUrl}
                download={downloadName}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                <Download className="h-4 w-4" />
                Download Excel
              </a>

            </div>

          </div>

        )}


        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

          {(invoiceFile || excelFile) && !loading && (

            <button
              onClick={resetAll}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Clear
            </button>

          )}

          <button
            onClick={processInvoice}
            disabled={!invoiceFile || loading}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >

            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Process Invoice
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}

          </button>

        </div>


        {/* Footer */}
        <footer className="mt-16 text-center">

          <p className="text-xs text-slate-400">
            Invoice Parser • AI-powered document processing
          </p>

        </footer>

      </main>

    </div>
  );
}


function FileCard({ file, type, onRemove }) {
  const isExcel = type === "excel";

  return (
    <div className="flex min-h-64 flex-col justify-center">

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">

            {isExcel ? (
              <FileSpreadsheet className="h-6 w-6 text-slate-600" />
            ) : (
              <FileText className="h-6 w-6 text-slate-600" />
            )}

          </div>


          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-slate-800">
              {file.name}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {formatFileSize(file.size)}
            </p>

          </div>


          <button
            onClick={onRemove}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700"
            title="Remove file"
          >
            <X className="h-5 w-5" />
          </button>

        </div>


        <div className="mt-5 flex items-center gap-2 rounded-lg bg-white px-3 py-2.5">

          <CheckCircle2 className="h-4 w-4 text-emerald-500" />

          <span className="text-xs font-medium text-slate-600">
            File ready for processing
          </span>

        </div>

      </div>

    </div>
  );
}

export default App;