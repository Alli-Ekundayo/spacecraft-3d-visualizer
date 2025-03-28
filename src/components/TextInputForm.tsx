
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { extractInformationFromText, formatExtractedInfo, ExtractedInfo } from '@/utils/nlpProcessor';

interface TextInputFormProps {
  onSubmit: (text: string, extractedInfo: ExtractedInfo) => void;
  isProcessing: boolean;
}

const TextInputForm: React.FC<TextInputFormProps> = ({ onSubmit, isProcessing }) => {
  const [text, setText] = useState('');
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    
    // If text is long enough, extract information in real-time
    if (e.target.value.length > 15) {
      const info = extractInformationFromText(e.target.value);
      setExtractedInfo(info);
    } else {
      setExtractedInfo(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim() && extractedInfo) {
      onSubmit(text, extractedInfo);
    }
  };
  
  const examples = [
    "A modern living room with a sofa, coffee table, and large windows. About 15ft by 12ft with white walls and wooden floors.",
    "A minimalist bedroom with a queen-sized bed, bedside tables, and a wardrobe. I prefer neutral colors and clean lines.",
    "A small kitchen with an island, white cabinets, and stainless steel appliances. About 10ft by 8ft with gray countertops."
  ];
  
  const handleExampleClick = (example: string) => {
    setText(example);
    const info = extractInformationFromText(example);
    setExtractedInfo(info);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Describe Your Space</CardTitle>
        <CardDescription>
          Provide details about your room, including dimensions, style preferences, and key features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Describe your space here... (e.g., 'A modern living room, 15ft x 12ft, with white walls, wooden floor, a large window...')"
            value={text}
            onChange={handleTextChange}
            className="min-h-[120px] mb-4"
          />
          
          {extractedInfo && (
            <div className="bg-design-light-gray p-3 rounded-md mb-4 text-sm">
              <h4 className="font-medium mb-1">We detected:</h4>
              <pre className="whitespace-pre-wrap text-xs">{formatExtractedInfo(extractedInfo)}</pre>
            </div>
          )}
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Try an example:</h4>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm"
                  type="button"
                  onClick={() => handleExampleClick(example)}
                >
                  Example {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={!text.trim() || isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Processing...' : 'Generate 3D Model'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TextInputForm;
