
import { Shield, BarChart3, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeTab: 'scan' | 'dashboard' | 'history';
  onTabChange: (tab: 'scan' | 'dashboard' | 'history') => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PhishGuard AI</h1>
              <p className="text-sm text-slate-400">Advanced Phishing Detection System</p>
            </div>
          </div>
          
          <nav className="flex space-x-2">
            <Button
              variant={activeTab === 'scan' ? 'default' : 'ghost'}
              onClick={() => onTabChange('scan')}
              className="text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Scan
            </Button>
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onTabChange('dashboard')}
              className="text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'history' ? 'default' : 'ghost'}
              onClick={() => onTabChange('history')}
              className="text-white"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
