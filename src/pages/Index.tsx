
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ScanForm } from '@/components/ScanForm';
import { Results } from '@/components/Results';
import { Dashboard } from '@/components/Dashboard';
import { ScanHistory } from '@/components/ScanHistory';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

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
  const { user, loading } = useAuth();
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [activeTab, setActiveTab] = useState<'scan' | 'dashboard' | 'history'>('scan');

  // Load scan history from database
  useEffect(() => {
    if (user) {
      loadScanHistory();
    }
  }, [user]);

  const loadScanHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading scan history:', error);
        return;
      }

      const formattedResults: ScanResult[] = data.map(result => ({
        id: result.id,
        url: result.url,
        timestamp: result.created_at,
        riskScore: result.risk_score,
        threats: result.threats,
        details: result.details as ScanResult['details']
      }));

      setScanHistory(formattedResults);
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  };

  const handleScanComplete = async (result: ScanResult) => {
    setCurrentScan(result);
    
    // Save to database if user is authenticated
    if (user) {
      try {
        const { error } = await supabase
          .from('scan_results')
          .insert({
            user_id: user.id,
            url: result.url,
            risk_score: result.riskScore,
            threats: result.threats,
            details: result.details
          });

        if (error) {
          console.error('Error saving scan result:', error);
        } else {
          // Reload history to include the new result
          loadScanHistory();
        }
      } catch (error) {
        console.error('Error saving scan result:', error);
      }
    } else {
      // For non-authenticated users, just update local state
      setScanHistory(prev => [result, ...prev.slice(0, 9)]);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
          <span className="text-white">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

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
