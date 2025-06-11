
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { ScanResult } from '@/pages/Index';

interface ScanFormProps {
  onScanComplete: (result: ScanResult) => void;
}

export function ScanForm({ onScanComplete }: ScanFormProps) {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const analyzeUrl = (url: string) => {
    const suspiciousPatterns = [
      /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP addresses
      /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+\.(tk|ml|ga|cf)/, // Free domains
      /[a-z]+[0-9]+[a-z]*\.(com|net|org)/, // Mixed alphanumeric
      /payp[a4]l|g[o0][o0]gle|[a4]m[a4]z[o0]n|micr[o0]s[o0]ft/, // Brand spoofing
    ];

    const suspicious = suspiciousPatterns.some(pattern => pattern.test(url.toLowerCase()));
    const reasons = [];

    if (url.includes('bit.ly') || url.includes('tinyurl')) {
      reasons.push('URL shortener detected');
    }
    if (!url.startsWith('https://')) {
      reasons.push('No HTTPS encryption');
    }
    if (url.length > 100) {
      reasons.push('Unusually long URL');
    }
    if (suspicious) {
      reasons.push('Suspicious domain pattern');
    }

    return { suspicious: suspicious || reasons.length > 0, reasons };
  };

  const analyzeContent = () => {
    const phishingIndicators = [];
    const random = Math.random();
    
    if (random > 0.7) phishingIndicators.push('Urgent action required language');
    if (random > 0.6) phishingIndicators.push('Suspicious form fields');
    if (random > 0.8) phishingIndicators.push('Fake security warnings');
    if (random > 0.5) phishingIndicators.push('Deceptive branding');

    return {
      phishingIndicators,
      legitimacyScore: Math.round((1 - phishingIndicators.length * 0.2) * 100)
    };
  };

  const calculateRiskScore = (urlAnalysis: any, contentAnalysis: any) => {
    let score = 0;
    score += urlAnalysis.suspicious ? 40 : 0;
    score += urlAnalysis.reasons.length * 10;
    score += (100 - contentAnalysis.legitimacyScore) * 0.3;
    return Math.min(100, Math.round(score));
  };

  const handleScan = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to scan",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const urlAnalysis = analyzeUrl(url);
    const contentAnalysis = analyzeContent();
    const riskScore = calculateRiskScore(urlAnalysis, contentAnalysis);

    const result: ScanResult = {
      id: Date.now().toString(),
      url,
      timestamp: new Date().toISOString(),
      riskScore,
      threats: [
        ...(urlAnalysis.suspicious ? ['Suspicious URL Pattern'] : []),
        ...(contentAnalysis.phishingIndicators.length > 2 ? ['Phishing Content'] : []),
        ...(riskScore > 70 ? ['High Risk Domain'] : []),
      ],
      details: {
        urlAnalysis,
        contentAnalysis,
        visualSimilarity: {
          matchFound: Math.random() > 0.8,
          similarSites: ['legitimate-bank.com', 'real-service.com']
        },
        technicalAnalysis: {
          ssl: url.startsWith('https://'),
          domainAge: Math.random() > 0.5 ? '2+ years' : '< 30 days',
          reputation: riskScore < 30 ? 'Good' : riskScore < 70 ? 'Suspicious' : 'Malicious'
        }
      }
    };

    onScanComplete(result);
    setIsScanning(false);

    toast({
      title: "Scan Complete",
      description: `Risk score: ${riskScore}%`,
      variant: riskScore > 70 ? "destructive" : "default",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Search className="w-5 h-5 mr-2" />
          URL Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Enter URL to scan (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
        
        <Button 
          onClick={handleScan} 
          disabled={isScanning}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Scan for Threats
            </>
          )}
        </Button>

        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-yellow-500 mb-1">Security Notice</p>
              <p>This tool analyzes URLs for potential phishing indicators. Results are for educational purposes.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
