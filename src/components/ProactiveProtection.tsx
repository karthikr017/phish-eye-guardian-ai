
import { useState } from 'react';
import { ClipboardMonitor } from './ClipboardMonitor';
import { BackgroundScanner } from './BackgroundScanner';
import { RealtimeNotifications } from './RealtimeNotifications';
import { UrlInterceptor } from './UrlInterceptor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Activity, Bell, Link, Zap } from 'lucide-react';

export function ProactiveProtection() {
  const [threatStats, setThreatStats] = useState({
    totalThreats: 0,
    blockedUrls: 0,
    scanCount: 0
  });

  const handleThreatDetected = (source: string, url: string, riskScore: number) => {
    console.log(`Threat detected from ${source}: ${url} (Risk: ${riskScore}%)`);
    setThreatStats(prev => ({
      ...prev,
      totalThreats: prev.totalThreats + 1
    }));
  };

  const handleUrlBlocked = (url: string, riskScore: number) => {
    console.log(`URL blocked: ${url} (Risk: ${riskScore}%)`);
    setThreatStats(prev => ({
      ...prev,
      blockedUrls: prev.blockedUrls + 1
    }));
  };

  const handleClipboardThreat = (url: string, riskScore: number, threats: string[]) => {
    console.log(`Clipboard threat: ${url}, Risk: ${riskScore}%, Threats: ${threats.join(', ')}`);
    setThreatStats(prev => ({
      ...prev,
      totalThreats: prev.totalThreats + 1
    }));
  };

  return (
    <div className="space-y-6">
      {/* Protection Overview */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Shield className="w-6 h-6 mr-2 text-blue-400" />
            Proactive Protection Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{threatStats.totalThreats}</div>
              <div className="text-sm text-slate-300">Threats Detected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{threatStats.blockedUrls}</div>
              <div className="text-sm text-slate-300">URLs Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{threatStats.scanCount}</div>
              <div className="text-sm text-slate-300">Active Scans</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center space-x-2 text-green-400">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Real-time Protection Active</span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              All protection systems are running and monitoring for threats across your device.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Protection Components Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ClipboardMonitor onThreatDetected={handleClipboardThreat} />
        <BackgroundScanner onThreatDetected={handleThreatDetected} />
        <RealtimeNotifications />
        <UrlInterceptor onUrlBlocked={handleUrlBlocked} />
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-medium text-white mb-1">Clipboard Monitor</h3>
            <p className="text-xs text-slate-400">Scans copied URLs automatically</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-medium text-white mb-1">Background Scanner</h3>
            <p className="text-xs text-slate-400">Continuous protection while you work</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4 text-center">
            <Bell className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <h3 className="font-medium text-white mb-1">Real-time Alerts</h3>
            <p className="text-xs text-slate-400">Instant threat notifications</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4 text-center">
            <Link className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-medium text-white mb-1">URL Interceptor</h3>
            <p className="text-xs text-slate-400">Blocks malicious links before access</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
