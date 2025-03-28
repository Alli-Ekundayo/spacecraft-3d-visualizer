
// Interface for processed image data
export interface ProcessedImage {
  dataUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  dominantColors?: string[];
}

// Process an uploaded image
export const processImage = async (file: File): Promise<ProcessedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Get basic image data
        const width = img.width;
        const height = img.height;
        const aspectRatio = width / height;
        
        // Create a small canvas to analyze the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size for analysis (smaller for performance)
        const analyzeWidth = 100;
        const analyzeHeight = Math.floor(analyzeWidth / aspectRatio);
        
        canvas.width = analyzeWidth;
        canvas.height = analyzeHeight;
        
        if (ctx) {
          // Draw image to canvas
          ctx.drawImage(img, 0, 0, analyzeWidth, analyzeHeight);
          
          // Extract dominant colors (simplified approach)
          const dominantColors = extractDominantColors(ctx, analyzeWidth, analyzeHeight);
          
          resolve({
            dataUrl: event.target?.result as string,
            width,
            height,
            aspectRatio,
            dominantColors
          });
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Simple function to extract dominant colors from an image
const extractDominantColors = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  colorCount: number = 5
): string[] => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  // Create a map to count color occurrences
  const colorMap: Record<string, number> = {};
  
  // Sample pixels (skip some for performance)
  for (let i = 0; i < pixels.length; i += 16) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    
    // Skip transparent pixels
    if (pixels[i + 3] < 128) continue;
    
    // Create a color key (simplify colors by rounding to nearest 10)
    const colorKey = `rgb(${Math.round(r/10)*10},${Math.round(g/10)*10},${Math.round(b/10)*10})`;
    
    if (colorMap[colorKey]) {
      colorMap[colorKey]++;
    } else {
      colorMap[colorKey] = 1;
    }
  }
  
  // Convert to array and sort by frequency
  const sortedColors = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, colorCount)
    .map(entry => entry[0]);
  
  return sortedColors;
};

// Function to normalize an image to specific dimensions (maintaining aspect ratio)
export const normalizeImageSize = (
  dataUrl: string, 
  targetWidth: number = 512, 
  targetHeight: number = 512
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      if (ctx) {
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        
        // Calculate dimensions preserving aspect ratio
        const aspectRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (aspectRatio > 1) {
          // Landscape orientation
          drawWidth = targetWidth;
          drawHeight = targetWidth / aspectRatio;
          offsetY = (targetHeight - drawHeight) / 2;
        } else {
          // Portrait or square orientation
          drawHeight = targetHeight;
          drawWidth = targetHeight * aspectRatio;
          offsetX = (targetWidth - drawWidth) / 2;
        }
        
        // Draw image centered in canvas
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Get normalized image
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = dataUrl;
  });
};
