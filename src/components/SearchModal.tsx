import React, { useState, useEffect } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Search, X, Users, Stethoscope, Package, Calendar, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    patients,
    doctors,
    medications,
    setSelectedPatientForAppointment,
    setActiveView
  } = useClinic();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedPatients = q
    ? patients
        .filter(
          p =>
            `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}`.toLowerCase().includes(q) ||
            p.curp.toLowerCase().includes(q) ||
            p.telefono.includes(q)
        )
        .slice(0, 4)
    : [];

  const matchedDoctors = q
    ? doctors
        .filter(
          d =>
            d.nombre.toLowerCase().includes(q) ||
            d.especialidad.toLowerCase().includes(q) ||
            d.consultorio.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  const matchedMeds = q
    ? medications
        .filter(m => m.nombre.toLowerCase().includes(q) || m.lote.toLowerCase().includes(q))
        .slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar paciente, médico, especialidad o medicamento..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4">
          {!q && (
            <div className="py-8 text-center text-xs text-slate-400">
              <p>Escribe al menos 2 letras para iniciar la búsqueda universal.</p>
              <div className="flex justify-center gap-2 mt-3">
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">Pacientes</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">Especialistas</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">Farmacia</span>
              </div>
            </div>
          )}

          {/* Patients Results */}
          {matchedPatients.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Pacientes ({matchedPatients.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchedPatients.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatientForAppointment(p);
                      setActiveView('agendar');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {p.nombre} {p.apellidoPaterno} {p.apellidoMaterno}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        CURP: {p.curp} · Tel: {p.telefono}
                      </p>
                    </div>
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1">
                      <span>Agendar Cita</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Doctors Results */}
          {matchedDoctors.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Médicos ({matchedDoctors.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchedDoctors.map(d => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveView('agendar');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{d.nombre}</p>
                      <p className="text-[11px] text-teal-600 dark:text-teal-400">{d.especialidad} · {d.consultorio}</p>
                    </div>
                    <span className="text-[11px] text-slate-400">Ver turno</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Medications Results */}
          {matchedMeds.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Farmacia ({matchedMeds.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchedMeds.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveView('inventario');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{m.nombre}</p>
                      <p className="text-[11px] text-slate-400">{m.concentracion} · Lote: {m.lote}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {m.stock} u.
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && matchedPatients.length === 0 && matchedDoctors.length === 0 && matchedMeds.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No se encontraron coincidencias para "{query}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Presiona ESC para salir</span>
          <kbd className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            ↵ Enter para seleccionar
          </kbd>
        </div>
      </div>
    </div>
  );
};
