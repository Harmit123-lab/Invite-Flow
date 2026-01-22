import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Slider } from "@/app/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";
import { Lock, Move, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

interface NamePlacementEditorProps {
  pdfPages: string[];
  onNext: (configs: PageConfig[]) => void;
  onBack: () => void;
}

export interface PageConfig {
  pageNumber: number;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  alignment: "left" | "center" | "right";
  lineSpacing: number;
  locked: boolean;
  enabled: boolean;
}

export function NamePlacementEditor({ pdfPages, onNext, onBack }: NamePlacementEditorProps) {
  // Mock PDF pages as images - in production, you'd use pdf.js to render each page
  const mockPages = Array.from({ length: 3 }, (_, i) => ({
    pageNumber: i + 1,
    image: `https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop&q=80`, // Wedding card placeholder
  }));

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageConfigs, setPageConfigs] = useState<PageConfig[]>(
    mockPages.map((page) => ({
      pageNumber: page.pageNumber,
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: "Noto Sans Gujarati",
      fontColor: "#000000",
      alignment: "center",
      lineSpacing: 1.2,
      locked: false,
      enabled: true,
    }))
  );

  const [isDragging, setIsDragging] = useState(false);

  const currentConfig = pageConfigs[currentPageIndex];

  const updateCurrentConfig = (updates: Partial<PageConfig>) => {
    setPageConfigs((prev) =>
      prev.map((config, index) =>
        index === currentPageIndex ? { ...config, ...updates } : config
      )
    );
  };

  const handleMouseDown = () => {
    if (!currentConfig.locked) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && !currentConfig.locked) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      updateCurrentConfig({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPageIndex < mockPages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
        </div>

        <h1 className="text-3xl mb-8">Place Names on Each Page</h1>

        {/* Page Navigation Tabs */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPageIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Tabs value={currentPageIndex.toString()} onValueChange={(v) => setCurrentPageIndex(parseInt(v))}>
                <TabsList>
                  {mockPages.map((page, index) => (
                    <TabsTrigger key={index} value={index.toString()} className="relative">
                      Page {page.pageNumber}
                      {pageConfigs[index].enabled && pageConfigs[index].locked && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPageIndex === mockPages.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Left: Preview Canvas */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">
                  Page {mockPages[currentPageIndex].pageNumber} Preview
                </h3>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Show Name on this page:</Label>
                  <input
                    type="checkbox"
                    checked={currentConfig.enabled}
                    onChange={(e) => updateCurrentConfig({ enabled: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>
              </div>
              
              <div
                className={`relative bg-white border-2 rounded-lg overflow-hidden ${
                  currentConfig.enabled ? "border-gray-300 cursor-move" : "border-gray-200 opacity-50"
                }`}
                style={{ aspectRatio: "3/4", maxHeight: "600px" }}
                onMouseDown={currentConfig.enabled ? handleMouseDown : undefined}
                onMouseMove={currentConfig.enabled ? handleMouseMove : undefined}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={mockPages[currentPageIndex].image}
                  alt={`Page ${mockPages[currentPageIndex].pageNumber}`}
                  className="w-full h-full object-contain"
                />
                {currentConfig.enabled && (
                  <div
                    className="absolute pointer-events-none select-none"
                    style={{
                      left: `${currentConfig.x}%`,
                      top: `${currentConfig.y}%`,
                      transform: "translate(-50%, -50%)",
                      fontSize: `${currentConfig.fontSize}px`,
                      fontFamily: currentConfig.fontFamily,
                      textAlign: currentConfig.alignment,
                      lineHeight: currentConfig.lineSpacing,
                      color: currentConfig.fontColor,
                      textShadow: "0 0 4px rgba(255,255,255,0.8)",
                    }}
                  >
                    {currentConfig.locked ? (
                      <Lock className="h-6 w-6 text-green-600" />
                    ) : (
                      <Move className="h-6 w-6 text-blue-600" />
                    )}
                    <div>Sample Name</div>
                    <div style={{ fontFamily: "Noto Sans Gujarati" }}>નમૂનો નામ</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right: Controls */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg">Page {mockPages[currentPageIndex].pageNumber} Settings</h3>

                {!currentConfig.enabled && (
                  <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-900">
                    Name placement is disabled for this page. Enable it to customize.
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Font Size: {currentConfig.fontSize}px</Label>
                  <Slider
                    value={[currentConfig.fontSize]}
                    onValueChange={([value]) => updateCurrentConfig({ fontSize: value })}
                    min={12}
                    max={72}
                    step={1}
                    disabled={!currentConfig.enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Font Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={currentConfig.fontColor}
                      onChange={(e) => updateCurrentConfig({ fontColor: e.target.value })}
                      className="w-20 h-10 cursor-pointer"
                      disabled={!currentConfig.enabled}
                    />
                    <Input
                      type="text"
                      value={currentConfig.fontColor}
                      onChange={(e) => updateCurrentConfig({ fontColor: e.target.value })}
                      placeholder="#000000"
                      className="flex-1"
                      disabled={!currentConfig.enabled}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select
                    value={currentConfig.fontFamily}
                    onValueChange={(value) => updateCurrentConfig({ fontFamily: value })}
                    disabled={!currentConfig.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Noto Sans Gujarati">Noto Sans Gujarati</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Text Alignment</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["left", "center", "right"] as const).map((align) => (
                      <Button
                        key={align}
                        variant={currentConfig.alignment === align ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateCurrentConfig({ alignment: align })}
                        disabled={!currentConfig.enabled}
                      >
                        {align}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Line Spacing: {currentConfig.lineSpacing.toFixed(1)}</Label>
                  <Slider
                    value={[currentConfig.lineSpacing]}
                    onValueChange={([value]) => updateCurrentConfig({ lineSpacing: value })}
                    min={0.8}
                    max={2}
                    step={0.1}
                    disabled={!currentConfig.enabled}
                  />
                </div>

                <Button
                  className="w-full"
                  variant={currentConfig.locked ? "default" : "outline"}
                  onClick={() => updateCurrentConfig({ locked: !currentConfig.locked })}
                  disabled={!currentConfig.enabled}
                >
                  {currentConfig.locked ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Position Locked
                    </>
                  ) : (
                    <>
                      <Move className="h-4 w-4 mr-2" />
                      Lock Position
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900 space-y-2">
                <p>💡 <strong>Tips:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Drag the name to position it</li>
                  <li>Lock position when satisfied</li>
                  <li>Configure each page separately</li>
                  <li>Disable pages that don't need names</li>
                </ul>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={() => onNext(pageConfigs)}
              >
                Next - Merge Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
