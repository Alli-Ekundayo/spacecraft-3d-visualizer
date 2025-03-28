
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw, ZoomIn, ZoomOut, MoveHorizontal, Save, Share2 } from 'lucide-react';

interface ThreeDControlsProps {
  onReset?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  disabled?: boolean;
}

const ThreeDControls: React.FC<ThreeDControlsProps> = ({
  onReset,
  onZoomIn,
  onZoomOut,
  onSave,
  onShare,
  disabled
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Controls</CardTitle>
        <CardDescription>
          Adjust your view of the 3D model
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2 mr-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onReset}
              disabled={disabled}
              title="Reset view"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onZoomIn}
              disabled={disabled}
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onZoomOut}
              disabled={disabled}
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={true}
              title="Pan (Use right-click + drag)"
            >
              <MoveHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onSave}
              disabled={disabled}
              title="Save view"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onShare}
              disabled={disabled}
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreeDControls;
