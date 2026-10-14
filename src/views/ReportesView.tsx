import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import { BarChart3, TrendingUp, Calendar, CheckCircle2, DollarSign, Users } from 'lucide-react';

export const ReportesView: React.FC = () => {
  const { appointments, patients, medications } = useClinic();
  const { colorTheme, colorDefinitions } = useTheme();
  const activeColor = colorDefinitions[colorTheme] || colorDefinitions.teal;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-teal-600 dark:text-teal-400">
            GESTIÓN & CONTROL / REPORTES
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Reportes Operativos y Estadísticas Clínicas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Métricas de ocupación, consultas atendidas y rotación de insumos médicos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Tasa de Ocupación</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            87.4%
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            +5.2% comparado al mes anterior
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Tiempo Promedio en Espera</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            14 minutos
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Rango óptimo hospitalario (&lt; 20 min)
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Cumplimiento de Citas</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            94.8%
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            Baja tasa de cancelación (5.2%)
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Consultas por Especialidad (Mes en Curso)
        </h3>
        <div className="space-y-3 mt-4">
          {[
            { name: 'Cardiología', count: 42, pct: 85 },
            { name: 'Medicina General', count: 68, pct: 95 },
            { name: 'Pediatría', count: 34, pct: 70 },
            { name: 'Dermatología', count: 28, pct: 60 },
            { name: 'Ginecología y Obstetricia', count: 31, pct: 65 }
          ].map(item => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                <span className="font-mono text-slate-500">{item.count} citas</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.pct}%`, backgroundColor: activeColor.hex }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
