"use client";
import { useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface ImageFocalPointModalProps {
  file: File;
  focalPoint: Point;
  onFocalPointChange: (point: Point) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FocalPointIndicator = ({ point }: { point: Point }) => (
  <div 
    className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    style={{ left: `${point.x}%`, top: `${point.y}%` }}
  >
    <div className="absolute inset-0 border-2 border-white rounded-full shadow-lg">
      <div className="absolute inset-1 border border-black rounded-full opacity-50"></div>
    </div>
    <div className="absolute w-px h-6 bg-white left-1/2 -top-1 shadow-lg"></div>
    <div className="absolute w-px h-6 bg-white left-1/2 -bottom-1 shadow-lg"></div>
    <div className="absolute h-px w-6 bg-white top-1/2 -left-1 shadow-lg"></div>
    <div className="absolute h-px w-6 bg-white top-1/2 -right-1 shadow-lg"></div>
  </div>
);

export default function ImageFocalPointModal({
  file,
  focalPoint,
  onFocalPointChange,
  onSave,
  onCancel
}: ImageFocalPointModalProps) {
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const updateFocalPoint = (e: React.MouseEvent) => {
    if (!imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    
    onFocalPointChange({ x: clampedX, y: clampedY });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Set Image Focal Point</h2>
          <p className="text-sm text-gray-500">Click anywhere on the image to set the focal point</p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Full Image with Focal Point Selection */}
            <div className="col-span-2">
              <div 
                className="relative w-full h-[400px] rounded-lg overflow-hidden cursor-crosshair bg-gray-100"
                ref={imageContainerRef}
                onClick={updateFocalPoint}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="Full preview"
                  className="w-full h-full object-contain"
                />
                <FocalPointIndicator point={focalPoint} />
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Card Preview:</p>
                <div className="bg-white rounded-lg shadow-md w-full overflow-hidden">
                  <div className="h-32 overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Card preview"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }}
                    />
                  </div>
                  <div className="p-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Banner Preview:</p>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-24 overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }}
                    />
                  </div>
                  <div className="p-2">
                    <div className="h-2 bg-gray-200 rounded w-1/2 mb-1"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 