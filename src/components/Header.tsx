import React, { useState, useRef, useEffect } from 'react';
import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Building2, 
  ChevronDown, 
  Plus, 
  Bell, 
  Moon, 
  Sun, 
  Search, 
  CheckCircle2, 
  Check, 
  LogOut, 
  AlertTriangle,
  Menu
} from 'lucide-react';

export const Header: React.FC<{ onToggleMobileSidebar?: () => void }> = ({ onToggleMobileSidebar }) => {
  const {
    facilities,
    selectedFacility,
    setSelectedFacility,
    setIsQuickAppointmentOpen,
    setIsSearchOpen,
    notifications,
    markNotificationAsRead,
    setActiveView
  } = useClinic();

  const { isDark, toggleDark, colorTheme, colorDefinitions } = useTheme();

  const [isFacilityOpen, setIsFacilityOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const facilityRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (facilityRef.current && !facilityRef.current.contains(e.target as Node)) {
        setIsFacilityOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter(n => !n.leido);
  const activeColor = colorDefinitions[colorTheme] || colorDefinitions.teal;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 transition-colors flex items-center justify-between gap-4">
      {/* Zone 1: Mobile toggle & Sede Selector */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Facility Dropdown */}
        <div className="relative" ref={facilityRef}>
          <button
            onClick={() => setIsFacilityOpen(!isFacilityOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="truncate max-w-[180px] sm:max-w-[240px]">{selectedFacility.nombre}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-0.5" />
          </button>

          {isFacilityOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-40 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cambiar Sede Hospitalaria</span>
              </div>
              {facilities.map(facility => (
                <button
                  key={facility.id}
                  onClick={() => {
                    setSelectedFacility(facility);
                    setIsFacilityOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                    selectedFacility.id === facility.id
                      ? 'bg-slate-100 dark:bg-slate-800/80 text-teal-600 dark:text-teal-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="truncate">
                    <p className="font-medium truncate">{facility.nombre}</p>
                    <p className="text-[10px] text-slate-400 truncate">{facility.direccion}</p>
                  </div>
                  {selectedFacility.id === facility.id && (
                    <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live sync pill badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Online / DB Sincronizada</span>
        </div>
      </div>

      {/* Zone 2: Global Search Bar */}
      <div className="flex-1 max-w-md mx-2 hidden md:block">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/50 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 text-xs transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Buscar paciente, médico o medicamento...</span>
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-500 dark:text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions, Dark Mode, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        {/* Dark Mode Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleDark();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 shadow-xs'
              : 'bg-slate-100/80 border-slate-200 text-slate-700 hover:bg-slate-200/80'
          }`}
          aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={isDark ? 'Modo oscuro activo. Clic para cambiar a modo claro' : 'Modo claro activo. Clic para cambiar a modo oscuro'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 dark:text-slate-200" />
          )}
          <span className="hidden sm:inline font-semibold">
            {isDark ? 'Oscuro' : 'Claro'}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-40 animate-in fade-in zoom-in-95">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">Centro de Notificaciones</span>
                <span className="text-[10px] text-slate-400 font-mono">{unreadNotifs.length} nuevas</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-3 text-left transition-colors cursor-pointer ${
                      !n.leido
                        ? 'bg-teal-50/40 dark:bg-teal-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {n.tipo === 'alerta' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : n.tipo === 'exito' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Bell className="w-4 h-4 text-teal-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{n.titulo}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{n.tiempo}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">{n.mensaje}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA: + Nueva Cita */}
        <button
          onClick={() => {
            setActiveView('agendar');
            setIsQuickAppointmentOpen(true);
          }}
          style={{ backgroundColor: activeColor.hex }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg shadow-xs hover:opacity-90 active:scale-98 transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Nueva Cita</span>
        </button>

        {/* User Profile */}
        <div className="relative pl-1 border-l border-slate-200 dark:border-slate-800" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              VM
            </div>
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">Dra. Valeria Montes</p>
              <p className="text-[10px] text-slate-400 leading-tight">Administrador Clínico</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-40 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Dra. Valeria Montes</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">v.montes@clinicacentral.com</p>
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  Matrícula: MED-74892
                </span>
              </div>

              <button
                onClick={() => {
                  alert('Sesión administrativa activa.');
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
