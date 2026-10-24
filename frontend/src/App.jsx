import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventorySearchPage from './pages/InventorySearchPage';
import PredictiveAlertsPage from './pages/PredictiveAlertsPage';
import TransfersPage from './pages/TransfersPage';
import DiagramsPage from './pages/DiagramsPage';
import SecurityCompliancePage from './pages/SecurityCompliancePage';
import ProductManagementPage from './pages/ProductManagementPage';
import BranchManagementPage from './pages/BranchManagementPage';
import CookieConsentBanner from './components/CookieConsentBanner';
import LegalModal from './components/LegalModal';
import { SUCURSALES, LOTES_CADUCIDAD, TRASLADOS_SUGERIDOS } from './services/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('SIIP_AUTH_SESSION');
      return saved ? JSON.parse(saved).currentUser : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const saved = localStorage.getItem('SIIP_AUTH_SESSION');
      return saved ? !!JSON.parse(saved).currentUser : false;
    } catch {
      return false;
    }
  });

  const [currentBranch, setCurrentBranch] = useState(() => {
    try {
      const saved = localStorage.getItem('SIIP_AUTH_SESSION');
      const b = saved ? JSON.parse(saved).currentBranch : null;
      if (b && SUCURSALES.some(s => s.id === b.id)) {
        return SUCURSALES.find(s => s.id === b.id);
      }
      return SUCURSALES[0];
    } catch {
      return SUCURSALES[0];
    }
  });

  const [currentTab, setCurrentTab] = useState(() => {
    try {
      return localStorage.getItem('SIIP_CURRENT_TAB') || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  const [customTransfers, setCustomTransfers] = useState([]);
  const [dataVersion, setDataVersion] = useState(0);

  // Sincronización reactiva global
  React.useEffect(() => {
    const handleUpdate = () => setDataVersion(v => v + 1);
    window.addEventListener('siip:data_updated', handleUpdate);
    return () => window.removeEventListener('siip:data_updated', handleUpdate);
  }, []);

  // Control del modal legal y de privacidad
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalInitialTab, setLegalInitialTab] = useState('privacidad');

  const criticalCount = LOTES_CADUCIDAD.filter(l => l.semaforo === 'ROJO').length;
  const pendingTransfersCount = TRASLADOS_SUGERIDOS.length;

  const handleOpenLegalModal = (tab = 'privacidad') => {
    setLegalInitialTab(tab);
    setLegalModalOpen(true);
  };

  const handleSelectBranch = (branch) => {
    setCurrentBranch(branch);
    try {
      const saved = localStorage.getItem('SIIP_AUTH_SESSION');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.currentBranch = branch;
        localStorage.setItem('SIIP_AUTH_SESSION', JSON.stringify(parsed));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSelectTab = (tab) => {
    setCurrentTab(tab);
    try {
      localStorage.setItem('SIIP_CURRENT_TAB', tab);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLoginSuccess = (userData) => {
    const user = {
      username: userData.username,
      name: userData.name,
      role: userData.role,
      roleTitle: userData.roleTitle
    };
    const branch = userData.branch || currentBranch || SUCURSALES[0];
    setCurrentUser(user);
    setCurrentBranch(branch);
    setIsAuthenticated(true);
    setCurrentTab('dashboard');
    try {
      localStorage.setItem('SIIP_AUTH_SESSION', JSON.stringify({ currentUser: user, currentBranch: branch }));
      localStorage.setItem('SIIP_CURRENT_TAB', 'dashboard');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem('SIIP_AUTH_SESSION');
      localStorage.removeItem('SIIP_CURRENT_TAB');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAddCustomTransfer = (newTransfer) => {
    setCustomTransfers(prev => [newTransfer, ...prev]);
  };

  // Si no está autenticado, SIEMPRE mostrar la pantalla de Login con sus políticas accesibles
  if (!isAuthenticated || !currentUser) {
    return (
      <>
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onOpenLegalModal={handleOpenLegalModal}
        />
        <CookieConsentBanner onOpenLegalModal={handleOpenLegalModal} />
        {legalModalOpen && (
          <LegalModal 
            initialTab={legalInitialTab} 
            onClose={() => setLegalModalOpen(false)} 
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      
      <Navbar
        currentUser={currentUser}
        currentBranch={currentBranch}
        onSelectBranch={handleSelectBranch}
        onLogout={handleLogout}
        criticalAlertsCount={criticalCount}
        onNavigate={handleSelectTab}
        onOpenLegalModal={handleOpenLegalModal}
      />

      <div className="flex-1 flex w-full">
        
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          alertsCount={criticalCount}
          transfersCount={pendingTransfersCount}
          onOpenLegalModal={handleOpenLegalModal}
        />

        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full min-w-0 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage
              currentBranch={currentBranch}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'search' && (
            <InventorySearchPage
              currentBranch={currentBranch}
              onSelectTransfer={handleAddCustomTransfer}
            />
          )}

          {currentTab === 'products' && (
            <ProductManagementPage
              currentBranch={currentBranch}
              currentUser={currentUser}
              onSelectTransfer={handleAddCustomTransfer}
            />
          )}

          {currentTab === 'branches' && (
            <BranchManagementPage
              currentBranch={currentBranch}
              onSelectBranch={handleSelectBranch}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'alerts' && (
            <PredictiveAlertsPage
              currentBranch={currentBranch}
              onNavigate={setCurrentTab}
              onSelectTransfer={handleAddCustomTransfer}
            />
          )}

          {currentTab === 'transfers' && (
            <TransfersPage
              extraTransfers={customTransfers}
            />
          )}

          {currentTab === 'diagrams' && (
            <DiagramsPage />
          )}

          {currentTab === 'compliance' && (
            <SecurityCompliancePage 
              onOpenLegalModal={handleOpenLegalModal}
            />
          )}
        </main>

      </div>

      {/* Banner flotante de Cookies (si no ha sido aceptado aún) */}
      <CookieConsentBanner onOpenLegalModal={handleOpenLegalModal} />

      {/* Modal Legal, Privacidad Ley 29733 y Derechos ARCO */}
      {legalModalOpen && (
        <LegalModal 
          initialTab={legalInitialTab} 
          onClose={() => setLegalModalOpen(false)} 
        />
      )}

    </div>
  );
}
