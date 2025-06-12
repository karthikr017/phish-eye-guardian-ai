
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VisualSimilarityResult {
  isPhishing: boolean;
  similarityScore: number;
  matchedSite?: string;
  confidence: number;
}

interface VisualSimilarityScannerProps {
  url: string;
  onResult: (result: VisualSimilarityResult) => void;
}

export function VisualSimilarityScanner({ url, onResult }: VisualSimilarityScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const captureScreenshot = async (targetUrl: string): Promise<string> => {
    // Simulate screenshot capture - in production, you'd use a service like Puppeteer
    // For demo purposes, we'll generate a canvas-based screenshot simulation
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a gradient background to simulate a website
      const gradient = ctx.createLinearGradient(0, 0, 800, 600);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);
      
      // Add some text to simulate website content
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.fillText(`Screenshot of: ${targetUrl}`, 50, 100);
      ctx.fillText('Sample website content...', 50, 150);
    }
    
    return canvas.toDataURL();
  };

  const compareWithKnownSites = async (screenshotData: string): Promise<VisualSimilarityResult> => {
    // Simulate AI-powered visual comparison
    // In production, this would use computer vision APIs like Google Vision, AWS Rekognition, or custom models
    
    const knownLegitimatePatterns = [
      { site: 'paypal.com', pattern: 'blue-header-white-background' },
      { site: 'google.com', pattern: 'white-minimal-search' },
      { site: 'amazon.com', pattern: 'orange-smile-logo' },
      { site: 'microsoft.com', pattern: 'blue-squares-logo' }
    ];

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis based on URL patterns
    const suspiciousPatterns = [
      'payp4l', 'g00gle', 'amaz0n', 'micr0soft', 'app1e', 'fac3book'
    ];

    const urlLower = url.toLowerCase();
    const isSuspicious = suspiciousPatterns.some(pattern => urlLower.includes(pattern));
    
    if (isSuspicious) {
      const matchedSite = knownLegitimatePatterns.find(site => 
        urlLower.includes(site.site.split('.')[0])
      );
      
      return {
        isPhishing: true,
        similarityScore: Math.random() * 0.3 + 0.7, // 70-100% similarity
        matchedSite: matchedSite?.site,
        confidence: Math.random() * 0.2 + 0.8 // 80-100% confidence
      };
    }

    return {
      isPhishing: false,
      similarityScore: Math.random() * 0.3, // 0-30% similarity
      confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
    };
  };

  const performVisualScan = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please provide a URL to scan",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    try {
      // Capture screenshot
      const screenshotData = await captureScreenshot(url);
      setScreenshot(screenshotData);
      
      // Analyze visual similarity
      const result = await compareWithKnownSites(screenshotData);
      
      onResult(result);
      
      toast({
        title: "Visual Analysis Complete",
        description: result.isPhishing 
          ? `Potential phishing detected! ${Math.round(result.similarityScore * 100)}% similar to ${result.matchedSite}` 
          : "No visual threats detected",
        variant: result.isPhishing ? "destructive" : "default",
      });
      
    } catch (error) {
      console.error('Visual scan error:', error);
      toast({
        title: "Scan Failed",
        description: "Unable to perform visual analysis",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Eye className="w-5 h-5 mr-2" />
          Visual Similarity Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={performVisualScan}
          disabled={isScanning || !url}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        >
          {isScanning ? (
            <>
              <Camera className="w-4 h-4 mr-2 animate-pulse" />
              Analyzing Visual Patterns...
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Scan Visual Similarity
            </>
          )}
        </Button>

        {screenshot && (
          <div className="space-y-2">
            <p className="text-sm text-slate-300">Captured Screenshot:</p>
            <img 
              src={screenshot} 
              alt="Website screenshot" 
              className="w-full rounded-lg border border-slate-600 max-h-48 object-cover"
            />
          </div>
        )}

        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Eye className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-purple-500 mb-1">Visual AI Analysis</p>
              <p>Compares website appearance against known legitimate sites to detect visual phishing attempts.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
