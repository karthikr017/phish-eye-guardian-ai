
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Shield, X, Check, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ThreatNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  url: string;
  riskScore: number;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actions: Array<{
    label: string;
    action: 'block' | 'report' | 'investigate' | 'dismiss';
    variant: 'default' | 'destructive' | 'outline';
  }>;
}

interface RealtimeNotificationsProps {
  onNewThreat?: (notification: ThreatNotification) => void;
}

export function RealtimeNotifications({ onNewThreat }: RealtimeNotificationsProps) {
  const [notifications, setNotifications] = useState<ThreatNotification[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [totalAlerts, setTotalAlerts] = useState(0);

  // Simulate real-time threat notifications
  const generateThreatNotification = (): ThreatNotification => {
    const threats = [
      {
        title: "Phishing Email Detected",
        message: "Suspicious email claiming to be from your bank",
        url: "https://fake-bank-security.malicious.com/login",
        source: "Email Client",
        severity: 'high' as const,
        riskScore: 85
      },
      {
        title: "Malicious Link in WhatsApp",
        message: "Suspicious link shared in group chat",
        url: "https://free-gift-scam.tk/claim",
        source: "WhatsApp",
        severity: 'critical' as const,
        riskScore: 95
      },
      {
        title: "Suspicious Website Warning",
        message: "Attempting to visit potentially dangerous site",
        url: "https://paypal-verification.phishing.ml",
        source: "Browser",
        severity: 'medium' as const,
        riskScore: 65
      },
      {
        title: "Social Media Threat",
        message: "Malicious link detected in Instagram DM",
        url: "https://instagram-prize.scam.ga",
        source: "Instagram",
        severity: 'high' as const,
        riskScore: 78
      }
    ];

    const threat = threats[Math.floor(Math.random() * threats.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      ...threat,
      actions: [
        { label: 'Block', action: 'block', variant: 'destructive' },
        { label: 'Report', action: 'report', variant: 'outline' },
        { label: 'Investigate', action: 'investigate', variant: 'default' },
        { label: 'Dismiss', action: 'dismiss', variant: 'outline' }
      ]
    };
  };

  useEffect(() => {
    if (!isEnabled) return;

    // Generate random threat notifications every 15-30 seconds
    const interval = setInterval(() => {
      const notification = generateThreatNotification();
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
      setTotalAlerts(prev => prev + 1);
      
      if (onNewThreat) {
        onNewThreat(notification);
      }

      // Show browser notification
      toast({
        title: `🚨 ${notification.title}`,
        description: notification.message,
        variant: "destructive",
      });

      // Browser notification API
      if (Notification.permission === 'granted') {
        new Notification(`PhishEye Alert: ${notification.title}`, {
          body: notification.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
    }, Math.random() * 15000 + 15000);

    return () => clearInterval(interval);
  }, [isEnabled, onNewThreat]);

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleAction = (notificationId: string, action: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    switch (action) {
      case 'block':
        toast({
          title: "URL Blocked",
          description: `Blocked access to ${notification.url}`,
        });
        break;
      case 'report':
        toast({
          title: "Threat Reported",
          description: "Thank you for reporting this threat to our security team",
        });
        break;
      case 'investigate':
        toast({
          title: "Investigation Started",
          description: "Opening detailed threat analysis...",
        });
        break;
      case 'dismiss':
        break;
    }

    // Remove notification after action
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-900/50 border-red-500';
      case 'high': return 'bg-orange-900/50 border-orange-500';
      case 'medium': return 'bg-yellow-900/50 border-yellow-500';
      case 'low': return 'bg-blue-900/50 border-blue-500';
      default: return 'bg-slate-700/50 border-slate-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Shield className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Real-time Alerts
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="destructive">{totalAlerts}</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEnabled(!isEnabled)}
              className="text-xs"
            >
              {isEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-slate-300">
              {isEnabled ? 'Monitoring active' : 'Monitoring disabled'}
            </span>
          </div>
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? 'ON' : 'OFF'}
          </Badge>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {isEnabled ? 'No threats detected. You\'re safe!' : 'Notifications disabled'}
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getSeverityColor(notification.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(notification.severity)}
                    <span className="font-medium text-white">{notification.title}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="text-xs">
                      {notification.source}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction(notification.id, 'dismiss')}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-slate-300 mb-2">{notification.message}</p>
                
                <div className="flex items-center space-x-2 mb-3 text-xs">
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-400 truncate">{notification.url}</span>
                  <Badge variant="destructive" className="text-xs">
                    {notification.riskScore}% Risk
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {notification.actions.map((action) => (
                    <Button
                      key={action.action}
                      variant={action.variant}
                      size="sm"
                      onClick={() => handleAction(notification.id, action.action)}
                      className="text-xs"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <div className="text-xs text-slate-500 mt-2">
                  {notification.timestamp}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Bell className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-orange-500 mb-1">Instant Threat Alerts</p>
              <p>Get immediate notifications when threats are detected across all your applications and communications.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
