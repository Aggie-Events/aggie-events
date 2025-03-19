"use client";
import { useState } from 'react';
import { MdClose, MdEdit } from 'react-icons/md';
import ImageFocalPointModal from './ImageFocalPointModal';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  value: File | null;
}

interface Point {
  x: number;
  y: number;
}

export default function ImageUploader({ onImageChange, value }: ImageUploaderProps) {
  const [focalPoint, setFocalPoint] = useState<Point>({ x: 50, y: 50 });
  const [showModal, setShowModal] = useState(false);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [tempFocalPoint, setTempFocalPoint] = useState<Point>({ x: 50, y: 50 });

  const handleImageSelect = (file: File) => {
    setTempFile(file);
    setTempFocalPoint({ x: 50, y: 50 });
    setShowModal(true);
  };

  const handleSave = () => {
    onImageChange(tempFile);
    setFocalPoint(tempFocalPoint);
    setShowModal(false);
    setTempFile(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setTempFile(null);
    setTempFocalPoint({ x: 50, y: 50 });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Upload Area */}
        <div>
          {value ? (
            <div className="relative w-full h-[300px] rounded-md overflow-hidden">
              <img
                src={URL.createObjectURL(value)}
                alt="Image preview"
                className="w-full h-full object-cover"
                style={{ objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempFile(value);
                    setTempFocalPoint(focalPoint);
                    setShowModal(true);
                  }}
                  className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Edit image"
                >
                  <MdEdit size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => onImageChange(null)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <MdClose size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="flex flex-col items-center justify-center w-full h-[300px] border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith('image/')) {
                  handleImageSelect(file);
                }
              }}
            >
              <div className="text-center">
                <p className="text-gray-600 mb-2">Drag and drop your image here</p>
                <p className="text-gray-500 mb-4">or</p>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span>Upload Image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageSelect(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && tempFile && (
        <ImageFocalPointModal
          file={tempFile}
          focalPoint={tempFocalPoint}
          onFocalPointChange={setTempFocalPoint}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
} 