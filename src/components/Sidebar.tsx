import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  CalendarPlus,
  Users,
  Stethoscope,
  Calendar,
  Sparkles,
  Building,
  Pill,
  Package,
  ShoppingCart,
  Receipt,
  BarChart3,
  Activity,
  X,
  Moon,
  Sun
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activeView, setActiveView } = useClinic();
  const { colorTheme, colorDefinitions, isDark, toggleDark } = useTheme();

  const activeColor = colorDefinitions[colorTheme] || colorDefinitions.teal;

  const navSections: NavSection[] = [
    {
      group: 'CLÍNICA',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'agendar', label: 'Agendar Cita', icon: CalendarPlus, highlight: true },
        { id: 'pacientes', label: 'Pacientes', icon: Users },
        { id: 'medicos', label: 'Médicos', icon: Stethoscope },
        { id: 'citas', label: 'Citas', icon: Calendar },
        { id: 'especialidades', label: 'Especialidades', icon: Sparkles },
        { id: 'consultorios', label: 'Consultorios', icon: Building }
      ]
    },
    {
      group: 'FARMACIA & OPERACIONES',
      items: [
        { id: 'medicamentos', label: 'Medicamentos', icon: Pill },
        { id: 'inventario', label: 'Inventario', icon: Package, badge: '1 Alerta' },
        { id: 'compras', label: 'Compras', icon: ShoppingCart },
        { id: 'ventas', label: 'Ventas', icon: Receipt }
      ]
    },
    {
      group: 'GESTIÓN & CONTROL',
      items: [
        { id: 'reportes', label: 'Reportes', icon: BarChart3 },
        { id: 'seguimiento', label: 'Seguimiento', icon: Activity }
      ]
    }
  ];

  const handleNav = (id: string) => {
    setActiveView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div className="h-16 px-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs transition-colors"
              style={{ backgroundColor: activeColor.hex }}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                App Médica
              </h1>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-none font-medium">
                Sistema Clínico Integral
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map(section => (
            <div key={section.group}>
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {section.group}
              </div>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon 
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? activeColor.classText : 'text-slate-400 dark:text-slate-500'
                          }`} 
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ${
                            item.badge.includes('Alerta')
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer info in sidebar with dark/light mode button */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
          <button
            type="button"
            onClick={toggleDark}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              )}
              <span>Modo: {isDark ? 'Oscuro' : 'Claro'}</span>
            </span>
            <span className="text-[10px] text-slate-400">Alternar</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
            <span>Versión 2.4-PHP/Modern</span>
            <span className="font-mono">v2.4.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
