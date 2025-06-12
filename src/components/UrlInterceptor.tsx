
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link, Shield, Globe, AlertTriangle, Lock, Unlock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface InterceptedUrl {
  id: string;
  url: string;
  timestamp: string;
  source: string;
  riskScore: number;
  status: 'blocked' | 'allowed' | 'pending';
  threats: string[];
}

interface UrlInterceptorProps {
  onUrlBlocked: (url: string, riskScore: number) => void;
}

export function UrlInterceptor({ onUrlBlocked }: UrlInterceptorProps) {
  const [isActive, setIsActive] = useState(false);
  const [interceptedUrls, setInterceptedUrls] = useState<InterceptedUrl[]>([]);
  const [blockedCount, setBlockedCount] = useState(0);
  const [allowedCount, setAllowedCount] = useState(0);

  // Simulate URL interception
  const simulateUrlIntercept = () => {
    const sources = ['Click', 'Redirect', 'Email Link', 'Social Media', 'Advertisement'];
    const urls = [
      'https://paypal-security-update.malicious-site.tk/verify',
      'https://amazon-winner.scam-domain.ml/prize',
      'https://microsoft-alert.fake-security.ga/urgent',
      'https://bank-verification.phishing-site.cf/login',
      'https://google.com/search?q=safe+query',
      'https://github.com/user/repository',
      'https://stackoverflow.com/questions/12345'
    ];

    const url = urls[Math.floor(Math.random() * urls.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    
    // Analyze risk
    const maliciousDomains = ['.tk', '.ml', '.ga', '.cf'];
    const suspiciousKeywords = ['paypal', 'amazon', 'microsoft', 'bank', 'security', 'verify', 'urgent', 'winner', 'prize'];
    
    let riskScore = 0;
    const threats: string[] = [];
    
    // Check domain
    if (maliciousDomains.some(domain => url.includes(domain))) {
      riskScore += 40;
      threats.push('Suspicious TLD');
    }
    
    // Check keywords
    const urlLower = url.toLowerCase();
    suspiciousKeywords.forEach(keyword => {
      if (urlLower.includes(keyword) && !url.includes('google.com') && !url.includes('github.com') && !url.includes('stackoverflow.com')) {
        riskScore += 15;
        threats.push('Suspicious keywords');
      }
    });

    // Check HTTPS
    if (!url.startsWith('https://')) {
      riskScore += 20;
      threats.push('No HTTPS');
    }

    const intercepted: InterceptedUrl = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      timestamp: new Date().toLocaleTimeString(),
      source,
      riskScore,
      status: riskScore > 50 ? 'blocked' : 'allowed',
      threats
    };

    setInterceptedUrls(prev => [intercepted, ...prev.slice(0, 9)]);
    
    if (intercepted.status === 'blocked') {
      setBlockedCount(prev => prev + 1);
      onUrlBlocked(url, riskScore);
      
      toast({
        title: "🛡️ Malicious URL Blocked!",
        description: `Prevented navigation to dangerous site`,
        variant: "destructive",
      });
    } else {
      setAllowedCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (!isActive) return;

    // Simulate URL interceptions every 10-20 seconds
    const interval = setInterval(() => {
      simulateUrlIntercept();
    }, Math.random() * 10000 + 10000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleUrlAction = (id: string, action: 'allow' | 'block') => {
    setInterceptedUrls(prev => 
      prev.map(url => 
        url.id === id 
          ? { ...url, status: action === 'allow' ? 'allowed' : 'blocked' }
          : url
      )
    );

    const url = interceptedUrls.find(u => u.id === id);
    if (url) {
      if (action === 'block') {
        setBlockedCount(prev => prev + 1);
        if (url.status === 'allowed') setAllowedCount(prev => prev - 1);
      } else {
        setAllowedCount(prev => prev + 1);
        if (url.status === 'blocked') setBlockedCount(prev => prev - 1);
      }

      toast({
        title: action === 'allow' ? "URL Allowed" : "URL Blocked",
        description: `${url.url.substring(0, 50)}...`,
        variant: action === 'allow' ? "default" : "destructive",
      });
    }
  };

  const toggleInterceptor = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "URL Interceptor Disabled" : "URL Interceptor Enabled",
      description: isActive 
        ? "URLs will no longer be intercepted and analyzed"
        : "Now intercepting and analyzing all URL navigation attempts",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'text-red-500';
      case 'allowed': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'blocked': return <Lock className="w-3 h-3" />;
      case 'allowed': return <Unlock className="w-3 h-3" />;
      case 'pending': return <AlertTriangle className="w-3 h-3" />;
      default: return <Globe className="w-3 h-3" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Link className="w-5 h-5 mr-2" />
            URL Interceptor
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <button
          onClick={toggleInterceptor}
          className={`w-full p-3 rounded-lg font-medium transition-colors ${
            isActive 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isActive ? (
            <>
              <Shield className="w-4 h-4 mr-2 inline" />
              Disable Interceptor
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 mr-2 inline" />
              Enable Interceptor
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="text-slate-300">Blocked</div>
            <div className="text-xl font-bold text-red-500">{blockedCount}</div>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="text-slate-300">Allowed</div>
            <div className="text-xl font-bold text-green-500">{allowedCount}</div>
          </div>
        </div>

        {isActive && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-300">Recent Interceptions</div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {interceptedUrls.length === 0 ? (
                <div className="text-center py-4 text-slate-500">
                  No URLs intercepted yet...
                </div>
              ) : (
                interceptedUrls.map((item) => (
                  <div key={item.id} className="bg-slate-700/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.source}
                        </Badge>
                        <span className="text-xs text-slate-500">{item.timestamp}</span>
                      </div>
                      <Badge 
                        variant={item.riskScore > 50 ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {item.riskScore}% Risk
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-slate-300 mb-2 break-all">
                      {item.url}
                    </div>
                    
                    {item.threats.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.threats.map((threat, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {threat}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {item.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUrlAction(item.id, 'block')}
                          className="text-xs"
                        >
                          Block
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUrlAction(item.id, 'allow')}
                          className="text-xs"
                        >
                          Allow
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Link className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-green-500 mb-1">URL Protection</p>
              <p>Intercepts and analyzes all URL navigation attempts before allowing access to potentially dangerous sites.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
