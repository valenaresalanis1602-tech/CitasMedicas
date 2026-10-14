import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import { Appointment } from '../types/clinic';
import {
  Calendar,
  Clock,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Check,
  X
} from 'lucide-react';

export const CitasAgendaView: React.FC = () => {
  const { appointments, updateAppointmentStatus, setActiveView } = useClinic();
  const { colorTheme, colorDefinitions } = useTheme();
  const activeColor = colorDefinitions[colorTheme] || colorDefinitions.teal;

  const [statusFilter, setStatusFilter] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = appointments.filter(a => {
    const matchesStatus = statusFilter === 'Todas' || a.estado === statusFilter;
    const matchesSearch =
      a.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.medicoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.especialidad.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-teal-600 dark:text-teal-400">
            CLÍNICA / AGENDA
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Agenda Médica y Control de Turnos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Programación de consultas, estados de atención y tiempos de espera.
          </p>
        </div>

        <button
          onClick={() => setActiveView('agendar')}
          style={{ backgroundColor: activeColor.hex }}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-90 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Agendar Nueva Cita</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por paciente, médico o especialidad..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30"
          />
        </div>

        {/* Status segmented controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto self-start sm:self-auto">
          {['Todas', 'Confirmada', 'En Espera', 'En Consulta', 'Completada', 'Cancelada'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{filteredAppointments.length} citas registradas</span>
          <span className="font-mono">Fecha base: 2026-10-14</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredAppointments.map(appt => {
            const statusColor = {
              'Confirmada': 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
              'En Espera': 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
              'En Consulta': 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
              'Completada': 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
              'Cancelada': 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
              'Pendiente': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }[appt.estado];

            return (
              <div
                key={appt.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Time box */}
                  <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {appt.hora}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {appt.fecha.slice(5)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {appt.pacienteNombre}
                      </h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${statusColor}`}>
                        {appt.estado}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {appt.medicoNombre} · <span className="font-semibold text-slate-700 dark:text-slate-300">{appt.especialidad}</span> ({appt.consultorio})
                    </p>

                    {appt.motivo && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic">
                        "{appt.motivo}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Status action switches */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, 'En Espera')}
                      className={`px-2 py-1 text-[11px] rounded-lg transition-colors cursor-pointer ${
                        appt.estado === 'En Espera' ? 'bg-amber-500 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      En Espera
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, 'En Consulta')}
                      className={`px-2 py-1 text-[11px] rounded-lg transition-colors cursor-pointer ${
                        appt.estado === 'En Consulta' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      En Consulta
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, 'Completada')}
                      className={`px-2 py-1 text-[11px] rounded-lg transition-colors cursor-pointer ${
                        appt.estado === 'Completada' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Atendido
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, 'Cancelada')}
                      className={`px-2 py-1 text-[11px] rounded-lg transition-colors cursor-pointer ${
                        appt.estado === 'Cancelada' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                      }`}
                      title="Cancelar cita"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 ml-2">
                    ${appt.costo}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
