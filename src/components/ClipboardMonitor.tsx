
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clipboard, Shield, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ClipboardMonitorProps {
  onThreatDetected: (url: string, riskScore: number, threats: string[]) => void;
}

export function ClipboardMonitor({ onThreatDetected }: ClipboardMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastScannedUrl, setLastScannedUrl] = useState<string>('');
  const [scanCount, setScanCount] = useState(0);

  const analyzeUrl = async (url: string) => {
    // Simulate real-time URL analysis
    const suspiciousPatterns = [
      'bit.ly', 'tinyurl', 'goo.gl', 'payp4l', 'g00gle', 'amaz0n', 
      'micr0soft', 'app1e', 'fac3book', 'bankofamer1ca'
    ];
    
    const threats: string[] = [];
    let riskScore = 0;
    
    // Check for suspicious patterns
    const urlLower = url.toLowerCase();
    suspiciousPatterns.forEach(pattern => {
      if (urlLower.includes(pattern)) {
        threats.push('Suspicious URL Pattern');
        riskScore += 20;
      }
    });
    
    // Check for HTTPS
    if (!url.startsWith('https://')) {
      threats.push('No HTTPS encryption');
      riskScore += 15;
    }
    
    // Check for suspicious TLD
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf'];
    if (suspiciousTlds.some(tld => url.includes(tld))) {
      threats.push('Suspicious domain extension');
      riskScore += 25;
    }
    
    // Check for URL shorteners
    const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl'];
    if (shorteners.some(shortener => url.includes(shortener))) {
      threats.push('URL shortener detected');
      riskScore += 10;
    }
    
    return { riskScore: Math.min(riskScore, 100), threats };
  };

  const scanClipboard = async () => {
    try {
      if (!navigator.clipboard) {
        console.log('Clipboard API not available');
        return;
      }

      const text = await navigator.clipboard.readText();
      
      // Check if it's a URL
      const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
      
      if (urlRegex.test(text) && text !== lastScannedUrl) {
        setLastScannedUrl(text);
        setScanCount(prev => prev + 1);
        
        const { riskScore, threats } = await analyzeUrl(text);
        
        if (riskScore > 30) {
          onThreatDetected(text, riskScore, threats);
          
          toast({
            title: "🚨 Suspicious URL Detected!",
            description: `Clipboard contains potentially dangerous link: ${text.substring(0, 50)}...`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "✅ URL Scan Complete",
            description: `Clipboard URL appears safe: ${text.substring(0, 50)}...`,
          });
        }
      }
    } catch (error) {
      console.error('Error reading clipboard:', error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      // Check clipboard every 2 seconds
      interval = setInterval(scanClipboard, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, lastScannedUrl]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      toast({
        title: "Clipboard Monitor Active",
        description: "Now monitoring clipboard for suspicious URLs",
      });
    } else {
      toast({
        title: "Clipboard Monitor Disabled",
        description: "Clipboard monitoring has been turned off",
      });
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Clipboard className="w-5 h-5 mr-2" />
            Clipboard Monitor
          </div>
          <Badge variant={isMonitoring ? "default" : "secondary"}>
            {isMonitoring ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <button
          onClick={toggleMonitoring}
          className={`w-full p-3 rounded-lg font-medium transition-colors ${
            isMonitoring 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isMonitoring ? (
            <>
              <Shield className="w-4 h-4 mr-2 inline" />
              Stop Monitoring
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2 inline" />
              Start Monitoring
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="text-slate-300">URLs Scanned</div>
            <div className="text-xl font-bold text-white">{scanCount}</div>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="text-slate-300">Status</div>
            <div className="flex items-center">
              {isMonitoring ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">Protected</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-yellow-500">Unprotected</span>
                </>
              )}
            </div>
          </div>
        </div>

        {lastScannedUrl && (
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="text-sm text-slate-300 mb-1">Last Scanned URL:</div>
            <div className="text-xs text-white break-all">{lastScannedUrl}</div>
          </div>
        )}

        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Clipboard className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-blue-500 mb-1">Real-time Protection</p>
              <p>Automatically scans URLs copied to your clipboard and alerts you to potential threats.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
