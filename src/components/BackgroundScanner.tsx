
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, AlertCircle, Shield, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BackgroundScannerProps {
  onThreatDetected: (source: string, url: string, riskScore: number) => void;
}

interface ScanActivity {
  id: string;
  timestamp: string;
  source: string;
  url: string;
  status: 'safe' | 'warning' | 'danger';
  riskScore: number;
}

export function BackgroundScanner({ onThreatDetected }: BackgroundScannerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [threatsBlocked, setThreatsBlocked] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ScanActivity[]>([]);
  const [uptime, setUptime] = useState(0);

  // Simulate background scanning of various sources
  const performBackgroundScan = async () => {
    const sources = ['Browser Tab', 'Email Client', 'Messaging App', 'Social Media'];
    const simulatedUrls = [
      'https://secure-bank-login.suspicious-domain.tk',
      'https://paypal-verification.fake-site.ml',
      'https://amazon-prize.scam-alert.ga',
      'https://microsoft-security.phishing.cf',
      'https://google.com',
      'https://github.com',
      'https://stackoverflow.com'
    ];

    const source = sources[Math.floor(Math.random() * sources.length)];
    const url = simulatedUrls[Math.floor(Math.random() * simulatedUrls.length)];
    
    // Simulate risk analysis
    const suspiciousKeywords = ['suspicious-domain', 'fake-site', 'scam-alert', 'phishing'];
    const isSuspicious = suspiciousKeywords.some(keyword => url.includes(keyword));
    const riskScore = isSuspicious ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 30);
    
    const activity: ScanActivity = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      source,
      url,
      status: riskScore > 70 ? 'danger' : riskScore > 40 ? 'warning' : 'safe',
      riskScore
    };

    setRecentActivity(prev => [activity, ...prev.slice(0, 4)]);
    setScanCount(prev => prev + 1);

    if (riskScore > 70) {
      setThreatsBlocked(prev => prev + 1);
      onThreatDetected(source, url, riskScore);
      
      toast({
        title: "🛡️ Threat Blocked!",
        description: `Blocked suspicious ${source.toLowerCase()} activity`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let scanInterval: NodeJS.Timeout;
    let uptimeInterval: NodeJS.Timeout;
    
    if (isRunning) {
      // Perform background scans every 8-15 seconds
      scanInterval = setInterval(() => {
        performBackgroundScan();
      }, Math.random() * 7000 + 8000);

      // Update uptime every second
      uptimeInterval = setInterval(() => {
        setUptime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (scanInterval) clearInterval(scanInterval);
      if (uptimeInterval) clearInterval(uptimeInterval);
    };
  }, [isRunning]);

  const toggleScanner = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setUptime(0);
      toast({
        title: "Background Scanner Started",
        description: "Now continuously monitoring for threats across all applications",
      });
    } else {
      toast({
        title: "Background Scanner Stopped",
        description: "Background protection has been disabled",
      });
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'danger': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'safe': return 'text-green-500';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger': return <AlertCircle className="w-3 h-3" />;
      case 'warning': return <AlertCircle className="w-3 h-3" />;
      case 'safe': return <Shield className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Background Scanner
          </div>
          <Badge variant={isRunning ? "default" : "secondary"}>
            {isRunning ? "Running" : "Stopped"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <button
          onClick={toggleScanner}
          className={`w-full p-3 rounded-lg font-medium transition-colors ${
            isRunning 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Activity className="w-4 h-4 mr-2 inline animate-pulse" />
              Stop Scanner
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2 inline" />
              Start Scanner
            </>
          )}
        </button>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-slate-700/50 p-2 rounded-lg text-center">
            <div className="text-slate-300 text-xs">Scans</div>
            <div className="text-lg font-bold text-white">{scanCount}</div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded-lg text-center">
            <div className="text-slate-300 text-xs">Blocked</div>
            <div className="text-lg font-bold text-red-500">{threatsBlocked}</div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded-lg text-center">
            <div className="text-slate-300 text-xs">Uptime</div>
            <div className="text-sm font-bold text-blue-500">{formatUptime(uptime)}</div>
          </div>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-300">
              <Clock className="w-4 h-4 mr-2" />
              Recent Activity
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="bg-slate-700/30 p-2 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={getStatusColor(activity.status)}>
                        {getStatusIcon(activity.status)}
                      </span>
                      <span className="text-slate-300">{activity.source}</span>
                      <span className="text-slate-500">{activity.timestamp}</span>
                    </div>
                    <span className={`font-medium ${getStatusColor(activity.status)}`}>
                      {activity.riskScore}%
                    </span>
                  </div>
                  <div className="text-slate-400 truncate mt-1">
                    {activity.url}
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="text-slate-500 text-center py-2">
                  No activity yet...
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Activity className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-purple-500 mb-1">Continuous Protection</p>
              <p>Monitors browser tabs, emails, messages, and social media for suspicious links in real-time.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
