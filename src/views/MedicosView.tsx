import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import { Stethoscope, Building, Phone, Mail, Clock, CalendarPlus } from 'lucide-react';

export const MedicosView: React.FC = () => {
  const { doctors, setActiveView } = useClinic();
  const { colorTheme, colorDefinitions } = useTheme();
  const activeColor = colorDefinitions[colorTheme] || colorDefinitions.teal;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-teal-600 dark:text-teal-400">
            CLÍNICA / EQUIPO MÉDICO
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Plantilla Médica y Consultorios Asignados
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Especialistas clínicos, turnos de consulta y disponibilidad de consultorio.
          </p>
        </div>

        <button
          onClick={() => setActiveView('agendar')}
          style={{ backgroundColor: activeColor.hex }}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-90 transition-all cursor-pointer"
        >
          <CalendarPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Agendar Cita Médica</span>
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {doctors.map(doc => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-xs"
                    style={{ backgroundColor: activeColor.hex }}
                  >
                    {doc.nombre.split(' ')[1]?.[0] || 'D'}
                    {doc.nombre.split(' ')[2]?.[0] || 'M'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {doc.nombre}
                    </h3>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-0.5">
                      {doc.especialidad}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400">{doc.cedula}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    doc.disponible
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {doc.disponible ? 'En Turno' : 'Fuera de Turno'}
                </span>
              </div>

              <div className="space-y-2 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{doc.consultorio}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{doc.horario}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{doc.telefono}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveView('agendar')}
              className="mt-4 w-full py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              Agendar con este Especialista
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
