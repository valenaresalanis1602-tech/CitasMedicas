import React, { useState, useEffect } from 'react';
import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import { Patient } from '../types/clinic';
import {
  Calendar,
  UserPlus,
  Search,
  Check,
  AlertCircle,
  User,
  Clock,
  Building,
  CheckCircle2,
  CalendarCheck2,
  Sparkles,
  Info,
  Phone,
  Mail,
  FileText,
  RotateCcw
} from 'lucide-react';

export const AgendarCitaView: React.FC = () => {
  const {
    patients,
    doctors,
    addPatient,
    addAppointment,
    selectedPatientForAppointment,
    setSelectedPatientForAppointment,
    setActiveView
  } = useClinic();

  const { colorTheme, colorDefinitions } = useTheme();
  const activeColor = colorDefinitions[colorTheme] || colorDefinitions.teal;

  // Cita form state
  const [patientSearch, setPatientSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState('09:00');
  const [consultationReason, setConsultationReason] = useState('');
  const [showSlotGrid, setShowSlotGrid] = useState(true);

  // New Patient form state
  const [newNombre, setNewNombre] = useState('');
  const [newApellidoPaterno, setNewApellidoPaterno] = useState('');
  const [newApellidoMaterno, setNewApellidoMaterno] = useState('');
  const [newFechaNacimiento, setNewFechaNacimiento] = useState('1995-01-01');
  const [newGenero, setNewGenero] = useState<'Masculino' | 'Femenino' | 'Otro'>('Masculino');
  const [newCurp, setNewCurp] = useState('');
  const [newTelefono, setNewTelefono] = useState('');
  const [newCorreo, setNewCorreo] = useState('');

  // UI Feedback
  const [appointmentFeedback, setAppointmentFeedback] = useState<string | null>(null);
  const [patientFeedback, setPatientFeedback] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  // Filter patients based on search
  const filteredPatients = patients.filter(p => {
    if (!patientSearch.trim()) return false;
    const term = patientSearch.toLowerCase();
    const fullName = `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}`.toLowerCase();
    return (
      fullName.includes(term) ||
      p.curp.toLowerCase().includes(term) ||
      p.telefono.includes(term)
    );
  }).slice(0, 6);

  // Specialties list
  const specialties = Array.from(new Set(doctors.map(d => d.especialidad)));

  // Available doctors for selected specialty
  const availableDoctors = selectedSpecialty
    ? doctors.filter(d => d.especialidad === selectedSpecialty)
    : doctors;

  // When specialty changes, reset or pick doctor
  useEffect(() => {
    if (selectedSpecialty) {
      const match = doctors.find(d => d.especialidad === selectedSpecialty);
      if (match) {
        setSelectedDoctorId(match.id);
        setSelectedRoom(match.consultorio);
      }
    }
  }, [selectedSpecialty, doctors]);

  // When doctor changes, auto-fill room and specialty
  const handleDoctorChange = (docId: string) => {
    setSelectedDoctorId(docId);
    const doc = doctors.find(d => d.id === docId);
    if (doc) {
      setSelectedSpecialty(doc.especialidad);
      setSelectedRoom(doc.consultorio);
    }
  };

  // If there is a pre-selected patient from context
  useEffect(() => {
    if (selectedPatientForAppointment) {
      setPatientSearch(`${selectedPatientForAppointment.nombre} ${selectedPatientForAppointment.apellidoPaterno}`);
    }
  }, [selectedPatientForAppointment]);

  // Calculate age for helper
  const calculateAge = (dateStr: string) => {
    if (!dateStr) return null;
    const birth = new Date(dateStr);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? age : null;
  };

  // Preset time slots
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Quick reason chips
  const quickReasons = [
    'Chequeo de rutina',
    'Dolor agudo / Malestar',
    'Revisión de laboratorio',
    'Control de hipertensión',
    'Certificado médico',
    'Seguimiento post-tratamiento'
  ];

  // Quick dates
  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setAppointmentDate(d.toISOString().split('T')[0]);
  };

  // Handle register new patient
  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre.trim() || !newApellidoPaterno.trim()) {
      setErrorFeedback('Por favor ingresa al menos nombre y apellido paterno.');
      return;
    }

    const created = addPatient({
      nombre: newNombre.trim(),
      apellidoPaterno: newApellidoPaterno.trim(),
      apellidoMaterno: newApellidoMaterno.trim(),
      fechaNacimiento: newFechaNacimiento,
      genero: newGenero,
      curp: (newCurp.trim() || `MEX${Date.now().toString().slice(-8)}`).toUpperCase(),
      telefono: newTelefono.trim() || '55 0000 0000',
      correo: newCorreo.trim() || 'paciente@medica.com'
    });

    // Auto-select for appointment
    setSelectedPatientForAppointment(created);
    setPatientSearch(`${created.nombre} ${created.apellidoPaterno} ${created.apellidoMaterno}`);

    // Reset right form
    setNewNombre('');
    setNewApellidoPaterno('');
    setNewApellidoMaterno('');
    setNewCurp('');
    setNewTelefono('');
    setNewCorreo('');
    setErrorFeedback(null);
    setPatientFeedback(`¡Paciente ${created.nombre} registrado exitosamente y vinculado a la cita!`);

    setTimeout(() => {
      setPatientFeedback(null);
    }, 5000);
  };

  // Handle save appointment
  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatientForAppointment && !patientSearch.trim()) {
      setErrorFeedback('Por favor selecciona un paciente o regístralo a la derecha.');
      return;
    }

    if (!selectedSpecialty) {
      setErrorFeedback('Por favor selecciona una especialidad médica.');
      return;
    }

    if (!selectedDoctorId) {
      setErrorFeedback('Por favor asigna un médico para la consulta.');
      return;
    }

    const patient = selectedPatientForAppointment || {
      id: `p_temp_${Date.now()}`,
      nombre: patientSearch.split(' ')[0] || 'Paciente',
      apellidoPaterno: patientSearch.split(' ')[1] || '',
      apellidoMaterno: '',
      telefono: '55 0000 0000',
      curp: 'TEMP999999XXXXXX00'
    };

    const doc = doctors.find(d => d.id === selectedDoctorId);

    const saved = addAppointment({
      pacienteId: patient.id,
      pacienteNombre: `${patient.nombre} ${patient.apellidoPaterno} ${'apellidoMaterno' in patient ? patient.apellidoMaterno : ''}`.trim(),
      pacienteTelefono: patient.telefono,
      pacienteCurp: patient.curp,
      especialidad: selectedSpecialty,
      medicoId: doc?.id || 'd1',
      medicoNombre: doc?.nombre || 'Dr. Médico Asignado',
      consultorio: selectedRoom || doc?.consultorio || 'Consultorio 101',
      fecha: appointmentDate,
      hora: appointmentTime,
      motivo: consultationReason || 'Consulta general programada',
      estado: 'Confirmada',
      costo: 750
    });

    setErrorFeedback(null);
    setAppointmentFeedback(`¡Cita agendada con éxito para ${saved.pacienteNombre} el ${saved.fecha} a las ${saved.hora} hrs!`);

    // Reset appointment form
    setSelectedPatientForAppointment(null);
    setPatientSearch('');
    setConsultationReason('');

    setTimeout(() => {
      setAppointmentFeedback(null);
    }, 6000);
  };

  const handleCancel = () => {
    setSelectedPatientForAppointment(null);
    setPatientSearch('');
    setSelectedSpecialty('');
    setSelectedDoctorId('');
    setSelectedRoom('');
    setConsultationReason('');
    setErrorFeedback(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Page Title Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          <span>CLÍNICA</span>
          <span>/</span>
          <span>GESTIÓN DE CITAS</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Agendar Nueva Cita y Gestión de Pacientes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Selecciona un paciente mediante el buscador inteligente o registra uno nuevo al instante.
            </p>
          </div>
          <button
            onClick={() => setActiveView('dashboard')}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Ver Dashboard General →
          </button>
        </div>
      </div>

      {/* Global Alerts / Toasts */}
      {appointmentFeedback && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-start gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">{appointmentFeedback}</p>
            <p className="text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">
              Notificación enviada a recepción y registrada en la base de datos de citas.
            </p>
          </div>
        </div>
      )}

      {patientFeedback && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 flex items-start gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">{patientFeedback}</p>
            <p className="text-blue-700/80 dark:text-blue-300/80 mt-0.5">
              Puedes completar los datos de su cita en la columna izquierda.
            </p>
          </div>
        </div>
      )}

      {errorFeedback && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-2.5 text-xs shadow-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorFeedback}</span>
        </div>
      )}

      {/* Split Grid Layout (Replicating exact 2-column medical workflow with elevated aesthetics) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Datos de la Cita (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs overflow-hidden transition-colors">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div 
                className="p-2 rounded-xl text-white shadow-xs"
                style={{ backgroundColor: activeColor.hex }}
              >
                <CalendarCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Datos de la Cita
                </h2>
                <p className="text-[11px] text-slate-400">
                  Asignación médica, consultorio y fecha programada
                </p>
              </div>
            </div>
            {selectedPatientForAppointment && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800">
                Paciente vinculado
              </span>
            )}
          </div>

          <form onSubmit={handleSaveAppointment} className="p-5 space-y-4">
            {/* Buscar y Seleccionar Paciente */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Buscar y Seleccionar Paciente <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={e => {
                    setPatientSearch(e.target.value);
                    if (selectedPatientForAppointment) {
                      setSelectedPatientForAppointment(null);
                    }
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Escribe el nombre, CURP o teléfono del paciente para filtrar..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Escribe parte del nombre y haz clic en la coincidencia deseada.
              </p>

              {/* Patient selected summary badge */}
              {selectedPatientForAppointment && (
                <div className="mt-2 p-2.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                      {selectedPatientForAppointment.nombre[0]}
                      {selectedPatientForAppointment.apellidoPaterno[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {selectedPatientForAppointment.nombre} {selectedPatientForAppointment.apellidoPaterno} {selectedPatientForAppointment.apellidoMaterno}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        CURP: {selectedPatientForAppointment.curp} · Tel: {selectedPatientForAppointment.telefono}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatientForAppointment(null);
                      setPatientSearch('');
                    }}
                    className="text-[11px] text-teal-700 dark:text-teal-300 hover:underline cursor-pointer"
                  >
                    Cambiar
                  </button>
                </div>
              )}

              {/* Patient suggestions drop panel */}
              {isSearchFocused && filteredPatients.length > 0 && !selectedPatientForAppointment && (
                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-30 max-h-56 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">
                    Resultados de búsqueda ({filteredPatients.length})
                  </div>
                  {filteredPatients.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPatientForAppointment(p);
                        setPatientSearch(`${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}`);
                        setIsSearchFocused(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800/50 last:border-0"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {p.nombre} {p.apellidoPaterno} {p.apellidoMaterno}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          CURP: {p.curp} · {p.telefono}
                        </p>
                      </div>
                      <span className="text-[10px] font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                        Seleccionar
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Especialidad & Médico Asignado Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Especialidad <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={e => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all cursor-pointer"
                >
                  <option value="">Seleccione una especialidad primero...</option>
                  {specialties.map(esp => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Médico Asignado <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={e => handleDoctorChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all cursor-pointer"
                >
                  <option value="">
                    {selectedSpecialty ? 'Seleccione médico asignado...' : 'Seleccione una especialidad...'}
                  </option>
                  {availableDoctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.nombre} ({doc.consultorio})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Consultorio & Fecha de Cita */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Consultorio Asignado
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={selectedRoom || (selectedDoctorId ? doctors.find(d => d.id === selectedDoctorId)?.consultorio : 'Seleccione un médico...')}
                    readOnly
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Fecha de Cita <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setQuickDate(0)}
                      className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Hoy
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <button
                      type="button"
                      onClick={() => setQuickDate(1)}
                      className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Mañana
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={e => setAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all cursor-pointer font-mono"
                />
              </div>
            </div>

            {/* Hora de Inicio con selector amigable (Slots Grid o Dropdown) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Hora de Inicio (Turno de Atención) <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowSlotGrid(!showSlotGrid)}
                  className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline"
                >
                  {showSlotGrid ? 'Ver selector clásico' : 'Ver cuadrícula de horarios'}
                </button>
              </div>

              {showSlotGrid ? (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {timeSlots.map(slot => {
                      const isSelected = appointmentTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setAppointmentTime(slot)}
                          className={`py-1 px-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-teal-600 text-white shadow-xs scale-102 font-semibold'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <select
                  value={appointmentTime}
                  onChange={e => setAppointmentTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono cursor-pointer"
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot} hrs (Turno de 30 min)</option>
                  ))}
                </select>
              )}
            </div>

            {/* Motivo de la Consulta with Smart Tag Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Motivo de la Consulta
                </label>
                <span className="text-[10px] text-slate-400">Opcional</span>
              </div>
              <textarea
                rows={3}
                value={consultationReason}
                onChange={e => setConsultationReason(e.target.value)}
                placeholder="Describe brevemente el motivo de la visita o sintomatología principal..."
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none"
              />

              {/* Quick Suggestion chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {quickReasons.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setConsultationReason(prev => (prev ? `${prev}, ${tag}` : tag))}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Form actions: Cancelar & Guardar Cita */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ backgroundColor: activeColor.hex }}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs hover:opacity-90 active:scale-98 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Guardar Cita</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Registrar Nuevo Paciente (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs overflow-hidden transition-colors">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Registrar Nuevo Paciente
              </h2>
              <p className="text-[11px] text-slate-400">
                Alta rápida para pacientes de primera vez
              </p>
            </div>
          </div>

          <form onSubmit={handleRegisterPatient} className="p-5 space-y-3.5">
            {/* Friendly guidance alert banner from original UI */}
            <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-900/60 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <p className="text-xs text-teal-800 dark:text-teal-200 leading-snug">
                ¿El paciente no aparece en el buscador de la izquierda? Regístralo aquí al instante para poder agendar su cita de inmediato.
              </p>
            </div>

            {/* Nombre(s) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre(s) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newNombre}
                onChange={e => setNewNombre(e.target.value)}
                placeholder="Ej. Ana Sofía"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Apellido Paterno & Apellido Materno */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Apellido Paterno <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newApellidoPaterno}
                  onChange={e => setNewApellidoPaterno(e.target.value)}
                  placeholder="Ej. Morales"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Apellido Materno
                </label>
                <input
                  type="text"
                  value={newApellidoMaterno}
                  onChange={e => setNewApellidoMaterno(e.target.value)}
                  placeholder="Ej. Del Río"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Fecha Nacimiento (with computed age) & Género */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Fecha Nacimiento
                  </label>
                  {calculateAge(newFechaNacimiento) && (
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono font-medium">
                      {calculateAge(newFechaNacimiento)} años
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  value={newFechaNacimiento}
                  onChange={e => setNewFechaNacimiento(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Género
                </label>
                <select
                  value={newGenero}
                  onChange={e => setNewGenero(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            {/* CURP (18 caracteres) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  CURP (18 caract.)
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {newCurp.length}/18
                </span>
              </div>
              <input
                type="text"
                maxLength={18}
                value={newCurp}
                onChange={e => setNewCurp(e.target.value.toUpperCase())}
                placeholder="EJ. AAAA000000HXXXXX00"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Teléfono (10 dígitos) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Teléfono (10 dígitos) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={newTelefono}
                  onChange={e => setNewTelefono(e.target.value)}
                  placeholder="Ej. 7771234567"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="email"
                  value={newCorreo}
                  onChange={e => setNewCorreo(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Button: Registrar Paciente */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 shadow-xs active:scale-99 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Registrar Paciente y Cargar a Cita</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
