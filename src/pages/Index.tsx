
import { useState } from 'react';
import { Header } from '@/components/Header';
import { ScanForm } from '@/components/ScanForm';
import { Results } from '@/components/Results';
import { Dashboard } from '@/components/Dashboard';
import { ScanHistory } from '@/components/ScanHistory';

export interface ScanResult {
  id: string;
  url: string;
  timestamp: string;
  riskScore: number;
  threats: string[];
  details: {
    urlAnalysis: {
      suspicious: boolean;
      reasons: string[];
    };
    contentAnalysis: {
      phishingIndicators: string[];
      legitimacyScore: number;
    };
    visualSimilarity: {
      matchFound: boolean;
      similarSites: string[];
    };
    technicalAnalysis: {
      ssl: boolean;
      domainAge: string;
      reputation: string;
    };
  };
}

const Index = () => {
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [activeTab, setActiveTab] = useState<'scan' | 'dashboard' | 'history'>('scan');

  const handleScanComplete = (result: ScanResult) => {
    setCurrentScan(result);
    setScanHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 scans
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'scan' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <ScanForm onScanComplete={handleScanComplete} />
            </div>
            <div>
              {currentScan && <Results result={currentScan} />}
            </div>
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <Dashboard scanHistory={scanHistory} />
        )}
        
        {activeTab === 'history' && (
          <ScanHistory scanHistory={scanHistory} onSelectScan={setCurrentScan} />
        )}
      </main>
    </div>
  );
};

export default Index;
