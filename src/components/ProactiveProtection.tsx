
import { useState } from 'react';
import { ClipboardMonitor } from './ClipboardMonitor';
import { BackgroundScanner } from './BackgroundScanner';
import { RealtimeNotifications } from './RealtimeNotifications';
import { BrowserNavigationGuard } from './BrowserNavigationGuard';
import { DownloadProtection } from './DownloadProtection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Activity, Bell, Globe, Download, Zap, Database } from 'lucide-react';

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
            Real-Time Protection Dashboard
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
          
          <div className="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-green-400">
              <Zap className="w-4 h-4" />
              <span className="font-medium">REAL Protection Systems Active</span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              Actual browser monitoring, download scanning, and clipboard protection running live.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Real Protection Components */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Database className="w-5 h-5 mr-2 text-green-500" />
          REAL Protection Systems
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <ClipboardMonitor onThreatDetected={handleClipboardThreat} />
          <BrowserNavigationGuard />
          <DownloadProtection />
        </div>
      </div>

      {/* Simulated Components */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-500" />
          Demo/Simulation Systems
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <BackgroundScanner onThreatDetected={handleThreatDetected} />
          <RealtimeNotifications />
        </div>
      </div>

      {/* Feature Status Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green-900/20 border-green-500/30">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-medium text-white mb-1">Clipboard Monitor</h3>
            <p className="text-xs text-green-400">REAL - Active Protection</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-900/20 border-green-500/30">
          <CardContent className="p-4 text-center">
            <Globe className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-medium text-white mb-1">Navigation Guard</h3>
            <p className="text-xs text-green-400">REAL - Browser Protection</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-900/20 border-green-500/30">
          <CardContent className="p-4 text-center">
            <Download className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-medium text-white mb-1">Download Scanner</h3>
            <p className="text-xs text-green-400">REAL - File Protection</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4 text-center">
            <Bell className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-medium text-white mb-1">App Monitoring</h3>
            <p className="text-xs text-slate-400">Demo - Requires Mobile App</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
