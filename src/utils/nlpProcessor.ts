
// Simple NLP processor for extracting relevant interior design information from text
export interface ExtractedInfo {
  roomType: string;
  dimensions?: {
    width?: number;
    length?: number;
    height?: number;
  };
  stylePreferences: string[];
  colorScheme: string[];
  furnitureItems: string[];
  specialRequests: string[];
}

// Extract key information from a text description
export const extractInformationFromText = (text: string): ExtractedInfo => {
  // This is a simplified implementation
  // In a real application, this would use more sophisticated NLP techniques
  
  const info: ExtractedInfo = {
    roomType: 'generic',
    dimensions: {},
    stylePreferences: [],
    colorScheme: [],
    furnitureItems: [],
    specialRequests: []
  };

  // Extract room type
  const roomTypes = ['living room', 'bedroom', 'kitchen', 'bathroom', 'office', 'dining room'];
  roomTypes.forEach(type => {
    if (text.toLowerCase().includes(type)) {
      info.roomType = type;
    }
  });

  // Extract style preferences
  const styles = ['modern', 'contemporary', 'minimalist', 'traditional', 'rustic', 'industrial', 'scandinavian'];
  styles.forEach(style => {
    if (text.toLowerCase().includes(style)) {
      info.stylePreferences.push(style);
    }
  });

  // Extract color preferences
  const colors = ['blue', 'red', 'green', 'yellow', 'white', 'black', 'gray', 'brown', 'beige'];
  colors.forEach(color => {
    if (text.toLowerCase().includes(color)) {
      info.colorScheme.push(color);
    }
  });

  // Extract furniture items
  const furnitureItems = ['sofa', 'table', 'chair', 'bed', 'desk', 'shelf', 'cabinet', 'wardrobe'];
  furnitureItems.forEach(item => {
    if (text.toLowerCase().includes(item)) {
      info.furnitureItems.push(item);
    }
  });

  // Extract dimensions from text (simplistic approach)
  const dimensionRegex = /(\d+(?:\.\d+)?)\s*(?:feet|foot|ft|meters|meter|m)\s*(?:by|x)\s*(\d+(?:\.\d+)?)\s*(?:feet|foot|ft|meters|meter|m)(?:\s*(?:by|x)\s*(\d+(?:\.\d+)?)\s*(?:feet|foot|ft|meters|meter|m))?/i;
  const dimensionMatch = text.match(dimensionRegex);
  
  if (dimensionMatch) {
    info.dimensions = {
      width: parseFloat(dimensionMatch[1]),
      length: parseFloat(dimensionMatch[2]),
      height: dimensionMatch[3] ? parseFloat(dimensionMatch[3]) : undefined
    };
  }

  // Find any special requests
  if (text.toLowerCase().includes('window') || text.toLowerCase().includes('natural light')) {
    info.specialRequests.push('Consider window placement and natural light');
  }
  
  if (text.toLowerCase().includes('storage') || text.toLowerCase().includes('space saving')) {
    info.specialRequests.push('Optimize for storage and space efficiency');
  }

  return info;
};

// Format the extracted information for display
export const formatExtractedInfo = (info: ExtractedInfo): string => {
  const sections = [];
  
  sections.push(`Room Type: ${info.roomType.charAt(0).toUpperCase() + info.roomType.slice(1)}`);
  
  if (info.dimensions && (info.dimensions.width || info.dimensions.length)) {
    const dimensions = [];
    if (info.dimensions.width) dimensions.push(`Width: ${info.dimensions.width}ft`);
    if (info.dimensions.length) dimensions.push(`Length: ${info.dimensions.length}ft`);
    if (info.dimensions.height) dimensions.push(`Height: ${info.dimensions.height}ft`);
    sections.push(`Dimensions: ${dimensions.join(', ')}`);
  }
  
  if (info.stylePreferences.length > 0) {
    sections.push(`Style Preferences: ${info.stylePreferences.join(', ')}`);
  }
  
  if (info.colorScheme.length > 0) {
    sections.push(`Color Scheme: ${info.colorScheme.join(', ')}`);
  }
  
  if (info.furnitureItems.length > 0) {
    sections.push(`Furniture: ${info.furnitureItems.join(', ')}`);
  }
  
  if (info.specialRequests.length > 0) {
    sections.push(`Special Considerations: ${info.specialRequests.join(', ')}`);
  }
  
  return sections.join('\n');
};

// Generate prompts for 3D generation based on extracted information
export const generatePromptFromInfo = (info: ExtractedInfo): string => {
  let prompt = `Generate a 3D model of a ${info.stylePreferences.join(' ')} ${info.roomType}`;
  
  if (info.dimensions && info.dimensions.width && info.dimensions.length) {
    prompt += ` with approximate dimensions of ${info.dimensions.width}ft x ${info.dimensions.length}ft`;
    if (info.dimensions.height) {
      prompt += ` x ${info.dimensions.height}ft`;
    }
  }
  
  if (info.colorScheme.length > 0) {
    prompt += ` featuring ${info.colorScheme.join(', ')} colors`;
  }
  
  if (info.furnitureItems.length > 0) {
    prompt += ` with ${info.furnitureItems.join(', ')}`;
  }
  
  if (info.specialRequests.length > 0) {
    prompt += `. Special considerations: ${info.specialRequests.join(', ')}`;
  }
  
  return prompt;
};
