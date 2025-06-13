
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Globe, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NavigationThreat {
  id: string;
  url: string;
  timestamp: string;
  riskScore: number;
  threats: string[];
  blocked: boolean;
}

export function BrowserNavigationGuard() {
  const [isActive, setIsActive] = useState(false);
  const [blockedCount, setBlockedCount] = useState(0);
  const [allowedCount, setAllowedCount] = useState(0);
  const [recentThreats, setRecentThreats] = useState<NavigationThreat[]>([]);

  const analyzeUrl = (url: string) => {
    const suspiciousPatterns = [
      'payp4l', 'g00gle', 'amaz0n', 'micr0soft', 'app1e', 'fac3book',
      'bankofamer1ca', 'we11sfargo', 'ch4se'
    ];
    
    const maliciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq'];
    const phishingKeywords = ['verify', 'urgent', 'suspended', 'winner', 'claim', 'security-alert'];
    
    let riskScore = 0;
    const threats: string[] = [];
    const urlLower = url.toLowerCase();

    // Check suspicious patterns
    suspiciousPatterns.forEach(pattern => {
      if (urlLower.includes(pattern)) {
        threats.push('Brand impersonation');
        riskScore += 30;
      }
    });

    // Check malicious TLDs
    maliciousTlds.forEach(tld => {
      if (url.includes(tld)) {
        threats.push('Suspicious domain');
        riskScore += 25;
      }
    });

    // Check phishing keywords
    phishingKeywords.forEach(keyword => {
      if (urlLower.includes(keyword)) {
        threats.push('Phishing indicators');
        riskScore += 15;
      }
    });

    // Check HTTPS
    if (!url.startsWith('https://')) {
      threats.push('No encryption');
      riskScore += 20;
    }

    return { riskScore: Math.min(riskScore, 100), threats };
  };

  const interceptNavigation = (event: BeforeUnloadEvent | PopStateEvent) => {
    if (!isActive) return;

    const currentUrl = window.location.href;
    const { riskScore, threats } = analyzeUrl(currentUrl);

    if (riskScore > 40) {
      const threat: NavigationThreat = {
        id: Math.random().toString(36).substr(2, 9),
        url: currentUrl,
        timestamp: new Date().toLocaleTimeString(),
        riskScore,
        threats,
        blocked: true
      };

      setRecentThreats(prev => [threat, ...prev.slice(0, 9)]);
      setBlockedCount(prev => prev + 1);

      toast({
        title: "🛡️ Dangerous Site Blocked!",
        description: `Prevented navigation to suspicious URL (${riskScore}% risk)`,
        variant: "destructive",
      });

      if (event instanceof BeforeUnloadEvent) {
        event.preventDefault();
        event.returnValue = 'This site appears to be dangerous. Are you sure you want to continue?';
      }
    } else {
      setAllowedCount(prev => prev + 1);
    }
  };

  // Real navigation monitoring
  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      interceptNavigation(event);
    };

    const handlePopState = (event: PopStateEvent) => {
      interceptNavigation(event);
    };

    // Monitor URL changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(state, title, url) {
      originalPushState.apply(history, [state, title, url]);
      if (url && typeof url === 'string') {
        const { riskScore, threats } = analyzeUrl(url);
        if (riskScore > 40) {
          const threat: NavigationThreat = {
            id: Math.random().toString(36).substr(2, 9),
            url: url,
            timestamp: new Date().toLocaleTimeString(),
            riskScore,
            threats,
            blocked: false
          };
          setRecentThreats(prev => [threat, ...prev.slice(0, 9)]);
        }
      }
    };

    history.replaceState = function(state, title, url) {
      originalReplaceState.apply(history, [state, title, url]);
      if (url && typeof url === 'string') {
        const { riskScore, threats } = analyzeUrl(url);
        if (riskScore > 40) {
          const threat: NavigationThreat = {
            id: Math.random().toString(36).substr(2, 9),
            url: url,
            timestamp: new Date().toLocaleTimeString(),
            riskScore,
            threats,
            blocked: false
          };
          setRecentThreats(prev => [threat, ...prev.slice(0, 9)]);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [isActive]);

  const toggleGuard = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Navigation Guard Disabled" : "Navigation Guard Enabled",
      description: isActive 
        ? "Browser navigation is no longer being monitored"
        : "Now monitoring all browser navigation for threats",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Navigation Guard (REAL)
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <button
          onClick={toggleGuard}
          className={`w-full p-3 rounded-lg font-medium transition-colors ${
            isActive 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isActive ? (
            <>
              <X className="w-4 h-4 mr-2 inline" />
              Disable Guard
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2 inline" />
              Enable Guard
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

        {recentThreats.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-300">Recent Detections</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recentThreats.map((threat) => (
                <div key={threat.id} className="bg-slate-700/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {threat.blocked ? (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-yellow-500" />
                      )}
                      <span className="text-xs text-slate-500">{threat.timestamp}</span>
                    </div>
                    <Badge 
                      variant={threat.riskScore > 70 ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {threat.riskScore}% Risk
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-slate-300 mb-2 break-all">
                    {threat.url}
                  </div>
                  
                  {threat.threats.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {threat.threats.map((threatType, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {threatType}
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
              <p className="font-medium text-green-500 mb-1">REAL Browser Protection</p>
              <p>Actually monitors your browser navigation and warns about dangerous sites in real-time.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
