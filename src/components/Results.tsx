
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, XCircle, Globe, Lock, Calendar, Star } from 'lucide-react';
import type { ScanResult } from '@/pages/Index';

interface ResultsProps {
  result: ScanResult;
}

export function Results({ result }: ResultsProps) {
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-400';
    if (score < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBadgeColor = (score: number) => {
    if (score < 30) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score < 70) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Risk Score Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Shield className="w-5 h-5 mr-2" />
            Threat Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getRiskColor(result.riskScore)}`}>
              {result.riskScore}%
            </div>
            <p className="text-slate-400">Risk Score</p>
            <Progress value={result.riskScore} className="mt-2" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {result.threats.map((threat, index) => (
              <Badge key={index} className={getRiskBadgeColor(result.riskScore)}>
                {threat}
              </Badge>
            ))}
            {result.threats.length === 0 && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                No threats detected
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* URL Analysis */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Globe className="w-5 h-5 mr-2" />
            URL Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Status</span>
              <div className="flex items-center">
                {result.details.urlAnalysis.suspicious ? (
                  <XCircle className="w-4 h-4 text-red-400 mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                )}
                <span className={result.details.urlAnalysis.suspicious ? 'text-red-400' : 'text-green-400'}>
                  {result.details.urlAnalysis.suspicious ? 'Suspicious' : 'Clean'}
                </span>
              </div>
            </div>
            
            {result.details.urlAnalysis.reasons.length > 0 && (
              <div>
                <p className="text-slate-300 text-sm font-medium mb-2">Issues Found:</p>
                <ul className="space-y-1">
                  {result.details.urlAnalysis.reasons.map((reason, index) => (
                    <li key={index} className="text-sm text-slate-400 flex items-center">
                      <AlertTriangle className="w-3 h-3 text-yellow-400 mr-2" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Technical Analysis */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Lock className="w-5 h-5 mr-2" />
            Technical Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">SSL Certificate</span>
                <div className="flex items-center">
                  {result.details.technicalAnalysis.ssl ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Domain Age</span>
                <span className="text-slate-400 text-sm">{result.details.technicalAnalysis.domainAge}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Reputation</span>
                <span className={`text-sm ${
                  result.details.technicalAnalysis.reputation === 'Good' ? 'text-green-400' :
                  result.details.technicalAnalysis.reputation === 'Suspicious' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {result.details.technicalAnalysis.reputation}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Legitimacy Score</span>
                <span className="text-slate-400 text-sm">{result.details.contentAnalysis.legitimacyScore}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
