
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, RotateCw, MessageCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface FeedbackPanelProps {
  onFeedbackSubmit: (feedback: { rating: 'positive' | 'negative'; comment: string }) => void;
  onRegenerate: () => void;
  isProcessing: boolean;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  onFeedbackSubmit,
  onRegenerate,
  isProcessing
}) => {
  const [rating, setRating] = React.useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = () => {
    if (!rating) return;
    
    setIsSubmitting(true);
    onFeedbackSubmit({ rating, comment });
    
    // Reset form
    setRating(null);
    setComment('');
    setIsSubmitting(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback</CardTitle>
        <CardDescription>
          Help us improve by providing feedback on the generated model
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={rating === 'positive' ? 'default' : 'outline'}
              onClick={() => setRating('positive')}
              disabled={isProcessing || isSubmitting}
              className="flex-1"
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              Like
            </Button>
            <Button
              variant={rating === 'negative' ? 'default' : 'outline'}
              onClick={() => setRating('negative')}
              disabled={isProcessing || isSubmitting}
              className="flex-1"
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              Dislike
            </Button>
          </div>
          
          {rating && (
            <div className="space-y-2">
              <Textarea
                placeholder="Tell us what you think..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isProcessing || isSubmitting}
                className="min-h-[80px]"
              />
              <Button
                onClick={handleSubmit}
                disabled={isProcessing || isSubmitting}
                className="w-full"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>
            </div>
          )}
          
          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={onRegenerate}
              disabled={isProcessing}
              className="w-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Regenerate Model
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackPanel;
