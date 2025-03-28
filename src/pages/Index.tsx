
import React, { useState } from 'react';
import { toast } from 'sonner';
import TextInputForm from '@/components/TextInputForm';
import ImageUploader from '@/components/ImageUploader';
import ThreeDViewer from '@/components/ThreeDViewer';
import ThreeDControls from '@/components/ThreeDControls';
import FeedbackPanel from '@/components/FeedbackPanel';
import { ExtractedInfo } from '@/utils/nlpProcessor';
import { ProcessedImage } from '@/utils/imageProcessor';
import { generatePromptFromInfo } from '@/utils/nlpProcessor';
import { generate3DModel, update3DModel, GenerationResult } from '@/utils/threeDGenerator';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [sceneData, setSceneData] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<ProcessedImage | null>(null);
  const [currentText, setCurrentText] = useState<string>('');
  const [currentInfo, setCurrentInfo] = useState<ExtractedInfo | null>(null);
  
  const handleTextSubmit = async (text: string, extractedInfo: ExtractedInfo) => {
    setIsProcessing(true);
    setCurrentText(text);
    setCurrentInfo(extractedInfo);
    
    try {
      const prompt = generatePromptFromInfo(extractedInfo);
      const result = await generate3DModel({
        textDescription: text,
        extractedInfo,
        image: currentImage,
        generationPrompt: prompt
      });
      
      if (result.status === 'success' && result.sceneData) {
        setSceneData(result.sceneData);
        toast.success('3D model generated successfully');
      } else {
        throw new Error(result.message || 'Failed to generate 3D model');
      }
    } catch (error) {
      console.error('Error generating 3D model:', error);
      toast.error('Failed to generate 3D model. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleImageProcessed = async (processedImage: ProcessedImage) => {
    setCurrentImage(processedImage);
    toast.success('Image processed successfully');
    
    // If we already have text description, regenerate the model with the new image
    if (currentText && currentInfo) {
      setIsProcessing(true);
      
      try {
        const prompt = generatePromptFromInfo(currentInfo);
        const result = await generate3DModel({
          textDescription: currentText,
          extractedInfo: currentInfo,
          image: processedImage,
          generationPrompt: prompt
        });
        
        if (result.status === 'success' && result.sceneData) {
          setSceneData(result.sceneData);
          toast.success('3D model updated with new image');
        } else {
          throw new Error(result.message || 'Failed to update 3D model');
        }
      } catch (error) {
        console.error('Error updating 3D model:', error);
        toast.error('Failed to update 3D model. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  const handleRegenerate = async () => {
    if (!currentText || !currentInfo) {
      toast.error('Please provide a description first');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const prompt = generatePromptFromInfo(currentInfo);
      const result = await generate3DModel({
        textDescription: currentText,
        extractedInfo: currentInfo,
        image: currentImage,
        generationPrompt: prompt
      });
      
      if (result.status === 'success' && result.sceneData) {
        setSceneData(result.sceneData);
        toast.success('3D model regenerated successfully');
      } else {
        throw new Error(result.message || 'Failed to regenerate 3D model');
      }
    } catch (error) {
      console.error('Error regenerating 3D model:', error);
      toast.error('Failed to regenerate 3D model. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleFeedbackSubmit = (feedback: { rating: 'positive' | 'negative'; comment: string }) => {
    // In a real application, this would send the feedback to a server
    console.log('Feedback received:', feedback);
    toast.success('Thank you for your feedback!');
  };
  
  // Camera control handlers (these would integrate with the ThreeDViewer component in a full implementation)
  const handleReset = () => {
    console.log('Reset view');
    toast.info('View reset');
  };
  
  const handleZoomIn = () => {
    console.log('Zoom in');
  };
  
  const handleZoomOut = () => {
    console.log('Zoom out');
  };
  
  const handleSave = () => {
    // In a real application, this would save the current view/model
    console.log('Save view');
    toast.success('Current view saved');
  };
  
  const handleShare = () => {
    // In a real application, this would generate a shareable link
    console.log('Share view');
    toast.success('Shareable link copied to clipboard');
  };
  
  return (
    <div className="min-h-screen bg-design-off-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            3D Interior Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Transform your space descriptions into interactive 3D models
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Input forms */}
          <div className="space-y-6">
            <TextInputForm
              onSubmit={handleTextSubmit}
              isProcessing={isProcessing}
            />
            <ImageUploader
              onImageProcessed={handleImageProcessed}
              isProcessing={isProcessing}
            />
          </div>
          
          {/* Middle column: 3D viewer */}
          <div className="lg:col-span-2 space-y-6">
            <ThreeDViewer
              sceneData={sceneData}
              isLoading={isProcessing}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ThreeDControls
                onReset={handleReset}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onSave={handleSave}
                onShare={handleShare}
                disabled={!sceneData || isProcessing}
              />
              <FeedbackPanel
                onFeedbackSubmit={handleFeedbackSubmit}
                onRegenerate={handleRegenerate}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
