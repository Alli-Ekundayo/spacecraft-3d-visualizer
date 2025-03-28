
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { processImage, ProcessedImage } from '@/utils/imageProcessor';

interface ImageUploaderProps {
  onImageProcessed: (processedImage: ProcessedImage) => void;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageProcessed, isProcessing }) => {
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    setIsProcessingImage(true);
    
    try {
      const processedImage = await processImage(file);
      setImage(processedImage);
      onImageProcessed(processedImage);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try another one.');
    } finally {
      setIsProcessingImage(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Reference Image</CardTitle>
        <CardDescription>
          Upload an image of your space or a similar room for reference.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {!image && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragging ? 'border-design-blue bg-design-light-blue/10' : 'border-gray-300 hover:border-design-blue'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                Drag and drop an image here or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supports: JPG, PNG, WEBP
              </p>
            </div>
          </div>
        )}
        
        {image && (
          <div className="relative">
            <img
              src={image.dataUrl}
              alt="Uploaded space"
              className="w-full rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {image.dominantColors && (
              <div className="mt-2 flex gap-1">
                {image.dominantColors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                    title={`Dominant color ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleButtonClick}
          disabled={isProcessing || isProcessingImage || !!image}
        >
          {isProcessingImage ? (
            'Processing image...'
          ) : image ? (
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Image ready</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Select image</span>
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageUploader;
