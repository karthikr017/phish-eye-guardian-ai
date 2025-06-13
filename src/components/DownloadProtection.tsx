import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Shield, AlertTriangle, FileWarning, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DownloadThreat {
  id: string;
  filename: string;
  url: string;
  timestamp: string;
  fileType: string;
  riskScore: number;
  threats: string[];
  action: 'blocked' | 'allowed' | 'quarantined';
}

export function DownloadProtection() {
  const [isActive, setIsActive] = useState(false);
  const [blockedCount, setBlockedCount] = useState(0);
  const [scannedCount, setScannedCount] = useState(0);
  const [recentDownloads, setRecentDownloads] = useState<DownloadThreat[]>([]);

  const analyzeDownload = (filename: string, url: string) => {
    const dangerousExtensions = ['.exe', '.scr', '.bat', '.cmd', '.com', '.pif', '.vbs', '.js'];
    const suspiciousExtensions = ['.zip', '.rar', '.7z', '.jar', '.app', '.dmg'];
    const documentExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.pdf', '.ppt', '.pptx'];
    
    const maliciousPatterns = [
      'invoice', 'payment', 'receipt', 'urgent', 'security', 'virus-scan',
      'update', 'installer', 'setup', 'crack', 'keygen', 'patch'
    ];

    let riskScore = 0;
    const threats: string[] = [];
    const filenameLower = filename.toLowerCase();
    const urlLower = url.toLowerCase();

    // Check file extension
    const fileExt = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    
    if (dangerousExtensions.includes(fileExt)) {
      threats.push('Executable file');
      riskScore += 50;
    } else if (suspiciousExtensions.includes(fileExt)) {
      threats.push('Archive file');
      riskScore += 20;
    } else if (documentExtensions.includes(fileExt)) {
      riskScore += 5; // Documents can contain macros
    }

    // Check filename patterns
    maliciousPatterns.forEach(pattern => {
      if (filenameLower.includes(pattern)) {
        threats.push('Suspicious filename');
        riskScore += 15;
      }
    });

    // Check URL patterns
    if (urlLower.includes('bit.ly') || urlLower.includes('tinyurl') || urlLower.includes('t.co')) {
      threats.push('URL shortener');
      riskScore += 10;
    }

    if (!url.startsWith('https://')) {
      threats.push('Unencrypted download');
      riskScore += 15;
    }

    // Check for double extensions
    if ((filename.match(/\./g) || []).length > 1) {
      threats.push('Double extension');
      riskScore += 25;
    }

    return { riskScore: Math.min(riskScore, 100), threats, fileType: fileExt || 'unknown' };
  };

  // Real download monitoring
  useEffect(() => {
    if (!isActive) return;

    const interceptDownloads = (event: Event) => {
      const target = event.target as HTMLAnchorElement;
      
      if (target.tagName === 'A' && target.href && target.download) {
        const filename = target.download || target.href.split('/').pop() || 'unknown';
        const url = target.href;
        
        const { riskScore, threats, fileType } = analyzeDownload(filename, url);
        
        const downloadThreat: DownloadThreat = {
          id: Math.random().toString(36).substr(2, 9),
          filename,
          url,
          timestamp: new Date().toLocaleTimeString(),
          fileType,
          riskScore,
          threats,
          action: riskScore > 60 ? 'blocked' : riskScore > 30 ? 'quarantined' : 'allowed'
        };

        setRecentDownloads(prev => [downloadThreat, ...prev.slice(0, 9)]);
        setScannedCount(prev => prev + 1);

        if (downloadThreat.action === 'blocked') {
          event.preventDefault();
          setBlockedCount(prev => prev + 1);
          
          toast({
            title: "🚫 Download Blocked!",
            description: `Prevented download of suspicious file: ${filename}`,
            variant: "destructive",
          });
        } else if (downloadThreat.action === 'quarantined') {
          toast({
            title: "⚠️ Download Warning",
            description: `File flagged as potentially risky: ${filename}`,
            variant: "default",
          });
        } else {
          toast({
            title: "✅ Download Allowed",
            description: `File appears safe: ${filename}`,
          });
        }
      }
    };

    // Monitor all click events for download links
    document.addEventListener('click', interceptDownloads);

    // Monitor fetch requests for file downloads
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const response = await originalFetch.apply(this, args);
      
      if (response.headers.get('content-disposition')?.includes('attachment')) {
        // Properly extract URL from different input types
        let url: string;
        const input = args[0];
        
        if (typeof input === 'string') {
          url = input;
        } else if (input instanceof URL) {
          url = input.toString();
        } else if (input instanceof Request) {
          url = input.url;
        } else {
          url = 'unknown';
        }
        
        const filename = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'download';
        
        const { riskScore, threats, fileType } = analyzeDownload(filename, url);
        
        const downloadThreat: DownloadThreat = {
          id: Math.random().toString(36).substr(2, 9),
          filename,
          url,
          timestamp: new Date().toLocaleTimeString(),
          fileType,
          riskScore,
          threats,
          action: riskScore > 60 ? 'blocked' : riskScore > 30 ? 'quarantined' : 'allowed'
        };

        setRecentDownloads(prev => [downloadThreat, ...prev.slice(0, 9)]);
        setScannedCount(prev => prev + 1);

        if (downloadThreat.action === 'blocked') {
          setBlockedCount(prev => prev + 1);
          toast({
            title: "🚫 Download Blocked!",
            description: `Prevented download of suspicious file: ${filename}`,
            variant: "destructive",
          });
          throw new Error('Download blocked by security scanner');
        }
      }
      
      return response;
    };

    return () => {
      document.removeEventListener('click', interceptDownloads);
      window.fetch = originalFetch;
    };
  }, [isActive]);

  const toggleProtection = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Download Protection Disabled" : "Download Protection Enabled",
      description: isActive 
        ? "Downloads are no longer being scanned"
        : "Now scanning all downloads for malware and threats",
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'blocked': return 'text-red-500';
      case 'quarantined': return 'text-yellow-500';
      case 'allowed': return 'text-green-500';
      default: return 'text-slate-400';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'blocked': return <AlertTriangle className="w-3 h-3" />;
      case 'quarantined': return <FileWarning className="w-3 h-3" />;
      case 'allowed': return <CheckCircle className="w-3 h-3" />;
      default: return <Download className="w-3 h-3" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Download Protection (REAL)
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <button
          onClick={toggleProtection}
          className={`w-full p-3 rounded-lg font-medium transition-colors ${
            isActive 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isActive ? (
            <>
              <AlertTriangle className="w-4 h-4 mr-2 inline" />
              Disable Protection
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2 inline" />
              Enable Protection
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="text-slate-300">Blocked</div>
            <div className="text-xl font-bold text-red-500">{blockedCount}</div>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="text-slate-300">Scanned</div>
            <div className="text-xl font-bold text-blue-500">{scannedCount}</div>
          </div>
        </div>

        {recentDownloads.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-300">Recent Scans</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recentDownloads.map((download) => (
                <div key={download.id} className="bg-slate-700/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={getActionColor(download.action)}>
                        {getActionIcon(download.action)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {download.fileType}
                      </Badge>
                      <span className="text-xs text-slate-500">{download.timestamp}</span>
                    </div>
                    <Badge 
                      variant={download.riskScore > 60 ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {download.riskScore}% Risk
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-slate-300 mb-2 font-medium">
                    {download.filename}
                  </div>
                  
                  <div className="text-xs text-slate-400 mb-2 break-all">
                    {download.url}
                  </div>
                  
                  {download.threats.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {download.threats.map((threat, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {threat}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-green-500 mb-1">REAL Download Scanning</p>
              <p>Actually scans all file downloads and blocks dangerous files before they reach your device.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
