
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import type { ScanResult } from '@/pages/Index';

interface DashboardProps {
  scanHistory: ScanResult[];
}

export function Dashboard({ scanHistory }: DashboardProps) {
  const stats = {
    totalScans: scanHistory.length,
    threatsDetected: scanHistory.filter(scan => scan.riskScore > 70).length,
    cleanSites: scanHistory.filter(scan => scan.riskScore < 30).length,
    averageRisk: scanHistory.length > 0 ? Math.round(scanHistory.reduce((sum, scan) => sum + scan.riskScore, 0) / scanHistory.length) : 0,
  };

  const riskDistribution = [
    { name: 'Low Risk', value: scanHistory.filter(scan => scan.riskScore < 30).length, color: '#10b981' },
    { name: 'Medium Risk', value: scanHistory.filter(scan => scan.riskScore >= 30 && scan.riskScore < 70).length, color: '#f59e0b' },
    { name: 'High Risk', value: scanHistory.filter(scan => scan.riskScore >= 70).length, color: '#ef4444' },
  ];

  const recentScans = scanHistory.slice(0, 7).map(scan => ({
    date: new Date(scan.timestamp).toLocaleDateString(),
    riskScore: scan.riskScore,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Scans</p>
                <p className="text-2xl font-bold text-white">{stats.totalScans}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Threats Detected</p>
                <p className="text-2xl font-bold text-red-400">{stats.threatsDetected}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Clean Sites</p>
                <p className="text-2xl font-bold text-green-400">{stats.cleanSites}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Average Risk</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.averageRisk}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Risk Score Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recentScans}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="riskScore" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {riskDistribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-slate-300">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
