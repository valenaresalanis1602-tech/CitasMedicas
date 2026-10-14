import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import { Patient } from '../types/clinic';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  HeartPulse,
  ChevronRight,
  Filter,
  CheckCircle2,
  CalendarPlus,
  ShieldCheck
} from 'lucide-react';

export const PacientesView: React.FC = () => {
  const { patients, setSelectedPatientForAppointment, setActiveView } = useClinic();
  const { colorTheme, colorDefinitions } = useTheme();
  const activeColor = colorDefinitions[colorTheme] || colorDefinitions.teal;

  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'Todos' | 'Masculino' | 'Femenino'>('Todos');
  const [selectedPatientDetail, setSelectedPatientDetail] = useState<Patient | null>(patients[0] || null);

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}`.toLowerCase().includes(search.toLowerCase()) ||
      p.curp.toLowerCase().includes(search.toLowerCase()) ||
      p.telefono.includes(search);

    const matchesGender = genderFilter === 'Todos' || p.genero === genderFilter;
    return matchesSearch && matchesGender;
  });

  const handleBookForPatient = (p: Patient) => {
    setSelectedPatientForAppointment(p);
    setActiveView('agendar');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-teal-600 dark:text-teal-400">
            CLÍNICA / EXPEDIENTES
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Directorio de Pacientes Registrados
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestión de expedientes, datos de contacto y programación directa de consultas.
          </p>
        </div>

        <button
          onClick={() => setActiveView('agendar')}
          style={{ backgroundColor: activeColor.hex }}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-90 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Registrar Paciente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, CURP o teléfono..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30"
          />
        </div>

        {/* Gender Filter Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          {(['Todos', 'Masculino', 'Femenino'] as const).map(g => (
            <button
              key={g}
              onClick={() => setGenderFilter(g)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                genderFilter === g
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Patients List (7 cols) + Selected Patient Details (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Patients Table / List */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Mostrando {filteredPatients.length} pacientes</span>
            <span>Padrón verificado</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[580px] overflow-y-auto">
            {filteredPatients.map(p => {
              const isSelected = selectedPatientDetail?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientDetail(p)}
                  className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-teal-50/50 dark:bg-teal-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                      {p.nombre[0]}
                      {p.apellidoPaterno[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {p.nombre} {p.apellidoPaterno} {p.apellidoMaterno}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate">
                        CURP: {p.curp} · {p.telefono}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookForPatient(p);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 rounded-lg hover:bg-teal-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CalendarPlus className="w-3 h-3" />
                      <span>Cita</span>
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Patient Clinical Card */}
        {selectedPatientDetail ? (
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl text-white flex items-center justify-center text-base font-bold shadow-xs"
                  style={{ backgroundColor: activeColor.hex }}
                >
                  {selectedPatientDetail.nombre[0]}
                  {selectedPatientDetail.apellidoPaterno[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedPatientDetail.nombre} {selectedPatientDetail.apellidoPaterno} {selectedPatientDetail.apellidoMaterno}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                    ID: {selectedPatientDetail.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">CURP</span>
                <p className="font-mono font-medium text-slate-900 dark:text-white mt-0.5 truncate">
                  {selectedPatientDetail.curp}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Grupo Sanguíneo</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedPatientDetail.tipoSangre || 'No registrado'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Teléfono</span>
                <p className="font-mono text-slate-900 dark:text-white mt-0.5">
                  {selectedPatientDetail.telefono}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Fecha Nacimiento</span>
                <p className="font-mono text-slate-900 dark:text-white mt-0.5">
                  {selectedPatientDetail.fechaNacimiento}
                </p>
              </div>
            </div>

            {selectedPatientDetail.alergias && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200">
                <span className="font-bold">⚠️ Alergias identificadas:</span> {selectedPatientDetail.alergias}
              </div>
            )}

            <button
              onClick={() => handleBookForPatient(selectedPatientDetail)}
              style={{ backgroundColor: activeColor.hex }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white shadow-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Agendar Cita para este Paciente</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
