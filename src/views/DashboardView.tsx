import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import {
  Users,
  Calendar,
  DollarSign,
  Package,
  AlertTriangle,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  RefreshCw,
  Building,
  TrendingUp,
  ChevronRight,
  Check
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    patients,
    appointments,
    medications,
    doctors,
    selectedFacility,
    setActiveView,
    updateAppointmentStatus,
    reorderMedication
  } = useClinic();

  const { colorTheme, colorDefinitions } = useTheme();
  const activeColor = colorDefinitions[colorTheme] || colorDefinitions.teal;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reorderSuccess, setReorderSuccess] = useState<string | null>(null);

  // Today's date filter
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.fecha === todayStr || a.fecha === '2026-10-14');

  // Breakdown counts
  const countCompletadas = todayAppointments.filter(a => a.estado === 'Completada').length;
  const countEspera = todayAppointments.filter(a => a.estado === 'En Espera' || a.estado === 'En Consulta').length;
  const countCanceladas = todayAppointments.filter(a => a.estado === 'Cancelada').length;
  const countProgramadas = todayAppointments.filter(a => a.estado === 'Confirmada' || a.estado === 'Pendiente').length;

  // Total daily billing
  const totalFacturacion = todayAppointments
    .filter(a => a.estado === 'Completada' || a.estado === 'En Consulta')
    .reduce((acc, curr) => acc + curr.costo, 0);

  // Total stock of medications
  const totalStockMedications = medications.reduce((acc, m) => acc + m.stock, 0);
  const criticalMedications = medications.filter(m => m.stock < m.stockMinimo);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleReorder = (medId: string, medName: string) => {
    reorderMedication(medId, 60);
    setReorderSuccess(`Se solicitó lote de reorden para ${medName} (+60 unidades).`);
    setTimeout(() => setReorderSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Live DB Synchronized Banner (From user's screenshot 2) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Base de datos sincronizada
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                EN VIVO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {todayAppointments.length} citas registradas para la jornada de hoy. Datos leídos directamente de <code className="font-mono text-slate-600 dark:text-slate-300">app_medica_citas</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleManualRefresh}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refrescar sincronización"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
          </button>
          <button
            onClick={() => setActiveView('reportes')}
            className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver reporte</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Header / Administrative Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-teal-600 dark:text-teal-400">
            SEDE PRINCIPAL · {selectedFacility.edificio} — {selectedFacility.piso}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Panel Administrativo — Clínica Central
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Resumen operativo general de atención a pacientes, farmacia activa y asignación de consultorios.
          </p>
        </div>

        <button
          onClick={() => setActiveView('agendar')}
          style={{ backgroundColor: activeColor.hex }}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-90 active:scale-98 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nueva Cita Rápida</span>
        </button>
      </div>

      {/* Reorder feedback alert */}
      {reorderSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{reorderSuccess}</span>
        </div>
      )}

      {/* 4 KPI Cards (Matching screenshot 2 exactly with tabular numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Pacientes Registrados */}
        <div 
          onClick={() => setActiveView('pacientes')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pacientes Registrados</span>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {patients.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-between">
            <span>Total en Pacientes</span>
            <span className="text-teal-600 dark:text-teal-400 font-medium">+4 esta semana</span>
          </div>
        </div>

        {/* KPI 2: Citas de la Jornada */}
        <div 
          onClick={() => setActiveView('citas')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Citas de la Jornada</span>
            <Calendar className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {todayAppointments.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate">
            <span className="tabular-nums font-medium">{countCompletadas} listas</span>
            <span className="mx-1">·</span>
            <span className="tabular-nums font-medium">{countEspera} espera</span>
            <span className="mx-1">·</span>
            <span className="tabular-nums font-medium text-rose-500">{countCanceladas} canc.</span>
          </div>
        </div>

        {/* KPI 3: Facturación del Día */}
        <div 
          onClick={() => setActiveView('ventas')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Facturación del Día</span>
            <DollarSign className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            ${totalFacturacion.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate">
            <span>Suma de Venta.total de hoy</span>
          </div>
        </div>

        {/* KPI 4: Stock Medicamentos */}
        <div 
          onClick={() => setActiveView('inventario')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Stock Medicamentos</span>
            <Package className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {totalStockMedications.toLocaleString('es-MX')}
          </div>
          <div className="text-xs mt-2 text-rose-600 dark:text-rose-400 font-medium truncate">
            {criticalMedications.length} lote(s) por vencer/reordenar
          </div>
        </div>
      </div>

      {/* Alertas Críticas de Inventario (From Screenshot 2) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Alertas Críticas de Inventario
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-medium">
              Menor a 15 u.
            </span>
          </div>
          <button
            onClick={() => setActiveView('inventario')}
            className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Ir a Gestión de Inventario</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {criticalMedications.map(med => (
            <div
              key={med.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{med.nombre}</p>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                  <span className="font-mono font-bold tabular-nums">{med.stock}</span> unidades restantes
                  <span className="text-slate-400 dark:text-slate-500 font-normal"> · Mínimo {med.stockMinimo} u.</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  Lote: {med.lote} · Vence: {med.fechaCaducidad}
                </p>
              </div>
              <button
                onClick={() => handleReorder(med.id, med.nombre)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                Reordenar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Queue & Medical Room Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Patients Queue (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Turnos y Pacientes en Sala (Hoy)
              </h2>
              <p className="text-[11px] text-slate-400">
                Flujo de atención en tiempo real de recepción y consultorios
              </p>
            </div>
            <button
              onClick={() => setActiveView('citas')}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
            >
              Ver agenda completa →
            </button>
          </div>

          <div className="space-y-2.5">
            {todayAppointments.map(appt => {
              const statusStyles = {
                'En Espera': 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                'En Consulta': 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                'Completada': 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                'Confirmada': 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
                'Pendiente': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
                'Cancelada': 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              }[appt.estado];

              return (
                <div
                  key={appt.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                      <span className="text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200">
                        {appt.hora}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {appt.pacienteNombre}
                        </p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${statusStyles}`}>
                          {appt.estado}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {appt.medicoNombre} · <span className="font-medium text-slate-700 dark:text-slate-300">{appt.especialidad}</span> ({appt.consultorio})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    {appt.estado === 'Confirmada' && (
                      <button
                        onClick={() => updateAppointmentStatus(appt.id, 'En Espera')}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
                      >
                        Llegó a Sala
                      </button>
                    )}
                    {appt.estado === 'En Espera' && (
                      <button
                        onClick={() => updateAppointmentStatus(appt.id, 'En Consulta')}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
                        Pasar a Consulta
                      </button>
                    )}
                    {appt.estado === 'En Consulta' && (
                      <button
                        onClick={() => updateAppointmentStatus(appt.id, 'Completada')}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      >
                        Finalizar Cita
                      </button>
                    )}
                    <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 ml-2">
                      ${appt.costo}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Doctor & Room Occupancy (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Consultorios Activos
              </h2>
              <p className="text-[11px] text-slate-400">
                Disponibilidad en Torre Médica
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Piso 1 - 3</span>
          </div>

          <div className="space-y-2.5">
            {doctors.map(doc => (
              <div
                key={doc.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {doc.consultorio}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        doc.disponible ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    {doc.nombre}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {doc.especialidad} · {doc.horario}
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('agendar')}
                  className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg"
                  title="Agendar en este consultorio"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
