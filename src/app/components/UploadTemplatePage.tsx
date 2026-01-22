import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Upload, FileText, CheckCircle } from "lucide-react";
import jsPDF from "jspdf";

interface UploadTemplatePageProps {
  onNext: (pdfPages: string[]) => void;
  onBack: () => void;
}

export function UploadTemplatePage({ onNext, onBack }: UploadTemplatePageProps) {
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      setIsProcessing(true);
      
      try {
        // Read PDF file
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Convert to base64 for storage
        const base64 = btoa(
          uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        
        // For now, we'll store the PDF as a single base64 string
        // and extract pages during name placement
        // This is a simplified version - in production you'd use pdf.js or similar
        const pdfDataUrl = `data:application/pdf;base64,${base64}`;
        
        // Store as array with single PDF for now
        // We'll parse pages in the next step
        setPdfPages([pdfDataUrl]);
        setIsUploaded(true);
        setIsProcessing(false);
      } catch (error) {
        console.error("Error processing PDF:", error);
        alert("Error processing PDF file. Please try again.");
        setIsProcessing(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleNext = () => {
    if (pdfPages.length > 0) {
      onNext(pdfPages);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
        </div>

        <h1 className="text-3xl mb-8">Upload Wedding Card PDF Template</h1>

        <Card className="mb-6">
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : isUploaded
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                {isProcessing ? (
                  <>
                    <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full" />
                    <p className="text-lg">Processing PDF...</p>
                  </>
                ) : isUploaded ? (
                  <>
                    <CheckCircle className="h-16 w-16 text-green-600" />
                    <div>
                      <p className="text-lg mb-1">✔ PDF uploaded successfully</p>
                      <p className="text-sm text-gray-600">{fileName}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPdfPages([]);
                          setFileName("");
                          setIsUploaded(false);
                        }}
                      >
                        Change PDF
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-16 w-16 text-gray-400" />
                    <div>
                      <p className="text-lg mb-1">
                        {isDragActive ? "Drop the PDF here" : "Drag & drop PDF file here"}
                      </p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 text-center">
                ✓ Supported format: PDF only
              </p>
              <p className="text-sm text-gray-600 text-center">
                ✓ Upload your complete wedding card template (can have multiple pages)
              </p>
            </div>
          </CardContent>
        </Card>

        {isUploaded && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <FileText className="h-12 w-12 text-blue-600" />
                <div className="flex-1">
                  <h3 className="text-lg mb-1">PDF Template Ready</h3>
                  <p className="text-sm text-gray-600">{fileName}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    In the next step, you can place guest names on each page of your PDF
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button size="lg" onClick={handleNext} disabled={!isUploaded || pdfPages.length === 0}>
            Next - Place Names on Pages
          </Button>
        </div>
      </div>
    </div>
  );
}
