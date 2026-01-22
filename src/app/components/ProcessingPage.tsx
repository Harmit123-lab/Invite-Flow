import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { CheckCircle, Download, Loader2 } from "lucide-react";

interface ProcessingPageProps {
  namesCount: number;
  onComplete: () => void;
}

export function ProcessingPage({ namesCount, onComplete }: ProcessingPageProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate PDF generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement("a");
    link.href = "#";
    link.download = "wedding_cards.zip";
    link.click();
    
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          {!isComplete ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              </div>
              <div>
                <h2 className="text-2xl mb-2">Generating PDFs...</h2>
                <p className="text-gray-600">Please wait while we create your personalized cards</p>
              </div>
              <div className="space-y-2">
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-gray-600">{progress}% Complete</p>
              </div>
              <div className="text-sm text-gray-500">
                Processing {Math.floor((progress / 100) * namesCount)} of {namesCount} cards
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl mb-2">✔ Files Ready!</h2>
                <p className="text-gray-600">Your personalized wedding cards are ready to download</p>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Files</p>
                      <p className="text-2xl">{namesCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Format</p>
                      <p className="text-2xl">ZIP</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button size="lg" className="w-full gap-2" onClick={handleDownload}>
                <Download className="h-5 w-5" />
                Download ZIP File
              </Button>

              <p className="text-xs text-gray-500">
                The ZIP file contains all your personalized PDF cards
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
