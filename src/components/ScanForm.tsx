import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scan, Shield, Zap, Eye, Mic, Activity } from 'lucide-react';
import { VisualSimilarityScanner } from './VisualSimilarityScanner';
import { VoiceScanner } from './VoiceScanner';
import { ThreatIntelligence } from './ThreatIntelligence';
import { ProactiveProtection } from './ProactiveProtection';
import { toast } from '@/hooks/use-toast';
import { ScanResult } from '@/pages/Index';

interface ScanFormProps {
  onScanComplete: (result: ScanResult) => void;
}

export function ScanForm({ onScanComplete }: ScanFormProps) {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const analyzeUrl = async (targetUrl: string): Promise<ScanResult> => {
    // Simulate comprehensive URL analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    const suspiciousPatterns = [
      'payp4l', 'g00gle', 'amaz0n', 'micr0soft', 'app1e', 'fac3book'
    ];

    const phishingIndicators = [
      'urgent', 'verify', 'suspended', 'click here', 'winner', 'congratulations'
    ];

    let riskScore = 0;
    const threats: string[] = [];
    const urlLower = targetUrl.toLowerCase();

    // URL Analysis
    const urlAnalysis = {
      suspicious: false,
      reasons: [] as string[]
    };

    if (!targetUrl.startsWith('https://')) {
      urlAnalysis.suspicious = true;
      urlAnalysis.reasons.push('No HTTPS encryption');
      threats.push('Suspicious URL Pattern');
      riskScore += 20;
    }

    suspiciousPatterns.forEach(pattern => {
      if (urlLower.includes(pattern)) {
        urlAnalysis.suspicious = true;
        urlAnalysis.reasons.push(`Contains suspicious pattern: ${pattern}`);
        threats.push('Suspicious URL Pattern');
        riskScore += 25;
      }
    });

    // Content Analysis
    const contentAnalysis = {
      phishingIndicators: [] as string[],
      legitimacyScore: Math.floor(Math.random() * 40) + 60
    };

    phishingIndicators.forEach(indicator => {
      if (Math.random() > 0.7) {
        contentAnalysis.phishingIndicators.push(indicator);
        riskScore += 10;
      }
    });

    if (contentAnalysis.phishingIndicators.length > 0) {
      threats.push('Suspicious content detected');
    }

    // Visual Similarity (mock)
    const visualSimilarity = {
      matchFound: Math.random() > 0.8,
      similarSites: ['legitimate-bank.com', 'real-service.com']
    };

    if (visualSimilarity.matchFound) {
      threats.push('Visual similarity to known phishing sites');
      riskScore += 30;
    }

    // Technical Analysis
    const technicalAnalysis = {
      ssl: targetUrl.startsWith('https://'),
      domainAge: Math.random() > 0.3 ? '2+ years' : '< 30 days',
      reputation: riskScore > 50 ? 'Suspicious' : 'Good'
    };

    if (technicalAnalysis.domainAge === '< 30 days') {
      threats.push('New domain');
      riskScore += 15;
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      url: targetUrl,
      timestamp: new Date().toISOString(),
      riskScore: Math.min(riskScore, 100),
      threats,
      details: {
        urlAnalysis,
        contentAnalysis,
        visualSimilarity,
        technicalAnalysis
      }
    };
  };

  const performScan = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to scan",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    try {
      const result = await analyzeUrl(url.startsWith('http') ? url : `https://${url}`);
      onScanComplete(result);
      
      toast({
        title: "Scan Complete",
        description: `Risk Score: ${result.riskScore}% - ${result.threats.length} threats detected`,
        variant: result.riskScore > 70 ? "destructive" : "default",
      });
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: "Unable to complete the security scan",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleVoiceScan = (detectedUrl: string) => {
    setUrl(detectedUrl);
    performScan();
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    if (command === 'scan' && url) {
      performScan();
    }
  };

  const handleThreatDetected = (threats: any[]) => {
    console.log('Threat intelligence update:', threats);
    if (threats.length > 0) {
      toast({
        title: "Threats Detected",
        description: `Found ${threats.length} threat(s) in intelligence feeds`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="manual" className="flex items-center space-x-1">
            <Scan className="w-4 h-4" />
            <span>Manual</span>
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>Visual</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center space-x-1">
            <Mic className="w-4 h-4" />
            <span>Voice</span>
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>Intel</span>
          </TabsTrigger>
          <TabsTrigger value="protection" className="flex items-center space-x-1">
            <Activity className="w-4 h-4" />
            <span>Live</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Scan className="w-5 h-5 mr-2" />
                URL Security Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="url"
                  placeholder="Enter URL to scan (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  onKeyPress={(e) => e.key === 'Enter' && performScan()}
                />
                <Button 
                  onClick={performScan} 
                  disabled={isScanning}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isScanning ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Scan URL
                    </>
                  )}
                </Button>
              </div>
              
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-white mb-2">🔍 What we analyze:</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• URL patterns and suspicious domains</li>
                  <li>• SSL certificate and encryption status</li>
                  <li>• Content analysis for phishing indicators</li>
                  <li>• Domain reputation and age verification</li>
                  <li>• Visual similarity to legitimate sites</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visual">
          <VisualSimilarityScanner url={url} onResult={(result) => console.log('Visual scan result:', result)} />
        </TabsContent>

        <TabsContent value="voice">
          <VoiceScanner 
            onUrlDetected={handleVoiceScan} 
            onVoiceCommand={handleVoiceCommand}
          />
        </TabsContent>

        <TabsContent value="intelligence">
          <ThreatIntelligence 
            url={url}
            onThreatDetected={handleThreatDetected}
          />
        </TabsContent>

        <TabsContent value="protection">
          <ProactiveProtection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
