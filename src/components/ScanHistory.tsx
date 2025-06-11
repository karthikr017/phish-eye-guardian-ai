
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, ExternalLink, Calendar } from 'lucide-react';
import type { ScanResult } from '@/pages/Index';

interface ScanHistoryProps {
  scanHistory: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
}

export function ScanHistory({ scanHistory, onSelectScan }: ScanHistoryProps) {
  const getRiskBadgeColor = (score: number) => {
    if (score < 30) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score < 70) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <History className="w-5 h-5 mr-2" />
          Scan History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {scanHistory.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No scans performed yet</p>
            <p className="text-sm text-slate-500">Your scan history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scanHistory.map((scan) => (
              <div 
                key={scan.id} 
                className="border border-slate-600 rounded-lg p-4 hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      <span className="text-white font-medium truncate">
                        {truncateUrl(scan.url)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-2">
                      <Badge className={getRiskBadgeColor(scan.riskScore)}>
                        Risk: {scan.riskScore}%
                      </Badge>
                      {scan.threats.map((threat, index) => (
                        <Badge key={index} variant="outline" className="text-slate-300 border-slate-600">
                          {threat}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(scan.timestamp)}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectScan(scan)}
                    className="ml-4 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
