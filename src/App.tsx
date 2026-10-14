import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { AgendarCitaView } from './views/AgendarCitaView';
import { DashboardView } from './views/DashboardView';
import { PacientesView } from './views/PacientesView';
import { CitasAgendaView } from './views/CitasAgendaView';
import { InventarioView } from './views/InventarioView';
import { MedicosView } from './views/MedicosView';
import { ReportesView } from './views/ReportesView';

const MainLayout: React.FC = () => {
  const { activeView } = useClinic();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Render view based on active navigation tab
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'agendar':
        return <AgendarCitaView />;
      case 'pacientes':
        return <PacientesView />;
      case 'citas':
        return <CitasAgendaView />;
      case 'medicos':
      case 'especialidades':
      case 'consultorios':
        return <MedicosView />;
      case 'medicamentos':
      case 'inventario':
      case 'compras':
      case 'ventas':
        return <InventarioView />;
      case 'reportes':
      case 'seguimiento':
        return <ReportesView />;
      default:
        return <AgendarCitaView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (offset by 256px on lg screens for sidebar) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Header */}
        <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        {/* View Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderView()}
        </main>
      </div>

      {/* Universal Search Modal (Cmd+K) */}
      <SearchModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ClinicProvider>
        <MainLayout />
      </ClinicProvider>
    </ThemeProvider>
  );
}
