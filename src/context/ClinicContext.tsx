import React, { createContext, useContext, useState } from 'react';
import { Appointment, Doctor, Facility, Medication, Patient } from '../types/clinic';

interface ClinicContextType {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  medications: Medication[];
  facilities: Facility[];
  selectedFacility: Facility;
  setSelectedFacility: (facility: Facility) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'fechaRegistro'>) => Patient;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'creadoEn'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['estado']) => void;
  reorderMedication: (id: string, amount?: number) => void;
  selectedPatientForAppointment: Patient | null;
  setSelectedPatientForAppointment: (patient: Patient | null) => void;
  isQuickAppointmentOpen: boolean;
  setIsQuickAppointmentOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  notifications: Array<{ id: string; titulo: string; mensaje: string; tipo: 'alerta' | 'info' | 'exito'; tiempo: string; leido: boolean }>;
  markNotificationAsRead: (id: string) => void;
}

const INITIAL_FACILITIES: Facility[] = [
  { id: '1', nombre: 'Sede Central — Torre Médica A', edificio: 'Torre A', piso: 'Piso 3', direccion: 'Av. Insurgentes Sur 1450, CDMX' },
  { id: '2', nombre: 'Sede Norte — Torre Médica B', edificio: 'Torre B', piso: 'Piso 1', direccion: 'Av. Lindavista 204, CDMX' },
  { id: '3', nombre: 'Sucursal Pedregal — Especialidades', edificio: 'Torre Ángeles', piso: 'Piso 4', direccion: 'Periférico Sur 3320, CDMX' }
];

const INITIAL_DOCTORS: Doctor[] = [
  { id: 'd1', nombre: 'Dra. Valeria Montes', especialidad: 'Cardiología', cedula: 'CED-893421', consultorio: 'Consultorio 301', telefono: '55 4920 1823', correo: 'v.montes@clinicacentral.com', horario: '08:00 - 15:00', disponible: true },
  { id: 'd2', nombre: 'Dr. Alejandro Rivas', especialidad: 'Medicina General', cedula: 'CED-712390', consultorio: 'Consultorio 102', telefono: '55 1209 8831', correo: 'a.rivas@clinicacentral.com', horario: '09:00 - 17:00', disponible: true },
  { id: 'd3', nombre: 'Dra. Sofía Mendoza', especialidad: 'Pediatría', cedula: 'CED-902184', consultorio: 'Consultorio 204', telefono: '55 6742 9910', correo: 's.mendoza@clinicacentral.com', horario: '08:30 - 16:30', disponible: true },
  { id: 'd4', nombre: 'Dr. Carlos Benítez', especialidad: 'Dermatología', cedula: 'CED-551029', consultorio: 'Consultorio 305', telefono: '55 3301 4452', correo: 'c.benitez@clinicacentral.com', horario: '10:00 - 18:00', disponible: true },
  { id: 'd5', nombre: 'Dra. Mariana Cordero', especialidad: 'Ginecología y Obstetricia', cedula: 'CED-448102', consultorio: 'Consultorio 201', telefono: '55 8821 7734', correo: 'm.cordero@clinicacentral.com', horario: '09:00 - 15:00', disponible: true },
  { id: 'd6', nombre: 'Dr. Roberto Garza', especialidad: 'Traumatología y Ortopedia', cedula: 'CED-661902', consultorio: 'Consultorio 108', telefono: '55 9182 3341', correo: 'r.garza@clinicacentral.com', horario: '11:00 - 19:00', disponible: false }
];

const INITIAL_PATIENTS: Patient[] = [
  { id: 'p1', nombre: 'Carlos Eduardo', apellidoPaterno: 'Hernández', apellidoMaterno: 'Gómez', fechaNacimiento: '1984-06-15', genero: 'Masculino', curp: 'HEGC840615HDFRMN02', telefono: '55 4123 9081', correo: 'carlos.hdz@gmail.com', fechaRegistro: '2026-01-10', tipoSangre: 'O+', alergias: 'Penicilina' },
  { id: 'p2', nombre: 'María Fernanda', apellidoPaterno: 'López', apellidoMaterno: 'Castillo', fechaNacimiento: '1992-11-23', genero: 'Femenino', curp: 'LOCM921123MDFRST09', telefono: '55 8831 2290', correo: 'mafer.lopez@outlook.com', fechaRegistro: '2026-02-14', tipoSangre: 'A+' },
  { id: 'p3', nombre: 'Santiago', apellidoPaterno: 'Navarro', apellidoMaterno: 'Pérez', fechaNacimiento: '2018-04-03', genero: 'Masculino', curp: 'NAPS180403HDFVRR01', telefono: '55 3321 0092', correo: 'padres.navarro@gmail.com', fechaRegistro: '2026-03-01', tipoSangre: 'B+' },
  { id: 'p4', nombre: 'Beatriz', apellidoPaterno: 'Morales', apellidoMaterno: 'Vázquez', fechaNacimiento: '1976-08-30', genero: 'Femenino', curp: 'MOVB760830MDFRZZ04', telefono: '55 7711 4423', correo: 'bmorales@empresa.com.mx', fechaRegistro: '2026-03-12', tipoSangre: 'O-' },
  { id: 'p5', nombre: 'Luis Fernando', apellidoPaterno: 'Ramírez', apellidoMaterno: 'Torres', fechaNacimiento: '1999-01-19', genero: 'Masculino', curp: 'RATL990119HDFRNT08', telefono: '55 9942 1109', correo: 'luis.ramirez99@gmail.com', fechaRegistro: '2026-03-25', tipoSangre: 'A-' },
  { id: 'p6', nombre: 'Elena', apellidoPaterno: 'Santillán', apellidoMaterno: 'Ríos', fechaNacimiento: '1988-09-12', genero: 'Femenino', curp: 'SARE880912MDFRLL05', telefono: '55 6601 2298', correo: 'elena.santillan@live.com', fechaRegistro: '2026-04-02', tipoSangre: 'AB+' }
];

// Generate up to 60 total patients to match the user's dashboard counter
const EXTRA_PATIENTS: Patient[] = Array.from({ length: 54 }).map((_, i) => {
  const index = i + 7;
  const year = 1970 + (index % 35);
  const month = String((index % 12) + 1).padStart(2, '0');
  const day = String((index % 27) + 1).padStart(2, '0');
  const isMale = index % 2 === 0;
  return {
    id: `p${index}`,
    nombre: isMale ? `Paciente ${index}` : `Paciente ${index}`,
    apellidoPaterno: ['Álvarez', 'Gutiérrez', 'Mendoza', 'Sánchez', 'Vargas', 'Reyes', 'Ortega', 'Díaz', 'Castillo'][index % 9],
    apellidoMaterno: ['Flores', 'Ruiz', 'Jiménez', 'Romero', 'Castro', 'Pineda', 'Soto', 'Medina'][index % 8],
    fechaNacimiento: `${year}-${month}-${day}`,
    genero: isMale ? 'Masculino' : 'Femenino',
    curp: `PAC${index}${year.toString().slice(2)}${month}${day}${isMale ? 'H' : 'M'}DFXX0${index % 9}`,
    telefono: `55 ${String(1000 + index * 43).slice(0, 4)} ${String(5000 + index * 27).slice(0, 4)}`,
    correo: `paciente${index}@ejemplo.com`,
    fechaRegistro: '2026-03-15',
    tipoSangre: ['O+', 'A+', 'B+', 'AB+'][index % 4]
  };
});

const ALL_PATIENTS = [...INITIAL_PATIENTS, ...EXTRA_PATIENTS];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'c1',
    pacienteId: 'p1',
    pacienteNombre: 'Carlos Eduardo Hernández Gómez',
    pacienteTelefono: '55 4123 9081',
    pacienteCurp: 'HEGC840615HDFRMN02',
    especialidad: 'Cardiología',
    medicoId: 'd1',
    medicoNombre: 'Dra. Valeria Montes',
    consultorio: 'Consultorio 301',
    fecha: '2026-10-14',
    hora: '09:00',
    motivo: 'Evaluación de hipertensión arterial y ecocardiograma de control',
    estado: 'En Espera',
    costo: 850,
    creadoEn: '2026-10-12 14:20'
  },
  {
    id: 'c2',
    pacienteId: 'p2',
    pacienteNombre: 'María Fernanda López Castillo',
    pacienteTelefono: '55 8831 2290',
    pacienteCurp: 'LOCM921123MDFRST09',
    especialidad: 'Medicina General',
    medicoId: 'd2',
    medicoNombre: 'Dr. Alejandro Rivas',
    consultorio: 'Consultorio 102',
    fecha: '2026-10-14',
    hora: '10:00',
    motivo: 'Cuadro respiratorio de 3 días de evolución y tos seca persistente',
    estado: 'En Consulta',
    costo: 600,
    creadoEn: '2026-10-13 11:05'
  },
  {
    id: 'c3',
    pacienteId: 'p3',
    pacienteNombre: 'Santiago Navarro Pérez',
    pacienteTelefono: '55 3321 0092',
    pacienteCurp: 'NAPS180403HDFVRR01',
    especialidad: 'Pediatría',
    medicoId: 'd3',
    medicoNombre: 'Dra. Sofía Mendoza',
    consultorio: 'Consultorio 204',
    fecha: '2026-10-14',
    hora: '11:30',
    motivo: 'Revisión periódica de desarrollo, peso y esquema de vacunación escolar',
    estado: 'Confirmada',
    costo: 750,
    creadoEn: '2026-10-13 16:40'
  },
  {
    id: 'c4',
    pacienteId: 'p4',
    pacienteNombre: 'Beatriz Morales Vázquez',
    pacienteTelefono: '55 7711 4423',
    pacienteCurp: 'MOVB760830MDFRZZ04',
    especialidad: 'Dermatología',
    medicoId: 'd4',
    medicoNombre: 'Dr. Carlos Benítez',
    consultorio: 'Consultorio 305',
    fecha: '2026-10-14',
    hora: '12:30',
    motivo: 'Seguimiento de dermatitis atópica y valoración de lesión en antebrazo',
    estado: 'Confirmada',
    costo: 900,
    creadoEn: '2026-10-14 07:15'
  }
];

const INITIAL_MEDICATIONS: Medication[] = [
  { id: 'm1', nombre: 'Amoxicilina 500mg', concentracion: '500mg / Cápsula', stock: 0, stockMinimo: 15, unidad: 'Cajas (20 caps)', lote: 'L-AMX-2026-08', fechaCaducidad: '2027-05-30', precioVenta: 145.00, estado: 'Agotado' },
  { id: 'm2', nombre: 'Paracetamol 500mg', concentracion: '500mg / Tableta', stock: 12, stockMinimo: 20, unidad: 'Cajas (20 tabs)', lote: 'L-PAR-2026-02', fechaCaducidad: '2027-11-15', precioVenta: 65.00, estado: 'Bajo' },
  { id: 'm3', nombre: 'Losartán 50mg', concentracion: '50mg / Gragea', stock: 180, stockMinimo: 30, unidad: 'Cajas (30 grag)', lote: 'L-LOS-2025-11', fechaCaducidad: '2028-02-28', precioVenta: 180.00, estado: 'Normal' },
  { id: 'm4', nombre: 'Metformina 850mg', concentracion: '850mg / Tableta', stock: 240, stockMinimo: 40, unidad: 'Cajas (40 tabs)', lote: 'L-MET-2026-01', fechaCaducidad: '2027-09-10', precioVenta: 120.00, estado: 'Normal' },
  { id: 'm5', nombre: 'Ibuprofeno 400mg', concentracion: '400mg / Cápsula', stock: 85, stockMinimo: 25, unidad: 'Cajas (10 caps)', lote: 'L-IBU-2026-04', fechaCaducidad: '2027-07-20', precioVenta: 95.00, estado: 'Normal' },
  { id: 'm6', nombre: 'Omeprazol 20mg', concentracion: '20mg / Cápsula', stock: 14, stockMinimo: 20, unidad: 'Cajas (14 caps)', lote: 'L-OME-2025-10', fechaCaducidad: '2026-12-15', precioVenta: 110.00, estado: 'Bajo' },
  { id: 'm7', nombre: 'Salbutamol Aerosol', concentracion: '100mcg / Dosis', stock: 32, stockMinimo: 10, unidad: 'Frasco aerosol', lote: 'L-SAL-2026-03', fechaCaducidad: '2028-01-30', precioVenta: 220.00, estado: 'Normal' },
  { id: 'm8', nombre: 'Solución Fisiológica 0.9%', concentracion: '500ml', stock: 120, stockMinimo: 50, unidad: 'Bolsa infusión', lote: 'L-FIS-2026-05', fechaCaducidad: '2028-06-30', precioVenta: 75.00, estado: 'Normal' }
];

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(ALL_PATIENTS);
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [facilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState<Facility>(INITIAL_FACILITIES[0]);
  const [activeView, setActiveView] = useState<string>('agendar'); // default to agendar or dashboard
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState<Patient | null>(null);

  const [isQuickAppointmentOpen, setIsQuickAppointmentOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<Array<{ id: string; titulo: string; mensaje: string; tipo: 'alerta' | 'info' | 'exito'; tiempo: string; leido: boolean }>>([
    {
      id: 'notif-1',
      titulo: 'Alerta crítica de farmacia',
      mensaje: 'Amoxicilina 500mg agotada (0 unidades restantes). Se requiere reorden inmediata.',
      tipo: 'alerta',
      tiempo: 'Hace 10 min',
      leido: false
    },
    {
      id: 'notif-2',
      titulo: 'Cita en sala de espera',
      mensaje: 'El paciente Carlos E. Hernández ha llegado a recepción para su cita de Cardiología.',
      tipo: 'info',
      tiempo: 'Hace 25 min',
      leido: false
    },
    {
      id: 'notif-3',
      titulo: 'Base de datos sincronizada',
      mensaje: 'Conexión verificada con app_medica_citas y expedientes clínicos.',
      tipo: 'exito',
      tiempo: 'Hace 1 h',
      leido: true
    }
  ]);

  const addPatient = (newPatientData: Omit<Patient, 'id' | 'fechaRegistro'>): Patient => {
    const newPatient: Patient = {
      ...newPatientData,
      id: `p${Date.now()}`,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => [newPatient, ...prev]);
    return newPatient;
  };

  const addAppointment = (newApptData: Omit<Appointment, 'id' | 'creadoEn'>): Appointment => {
    const newAppointment: Appointment = {
      ...newApptData,
      id: `c${Date.now()}`,
      creadoEn: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setAppointments(prev => [newAppointment, ...prev]);
    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['estado']) => {
    setAppointments(prev =>
      prev.map(item => (item.id === id ? { ...item, estado: status } : item))
    );
  };

  const reorderMedication = (id: string, amount: number = 50) => {
    setMedications(prev =>
      prev.map(med => {
        if (med.id === id) {
          const newStock = med.stock + amount;
          return {
            ...med,
            stock: newStock,
            estado: newStock > med.stockMinimo ? 'Normal' : 'Bajo'
          };
        }
        return med;
      })
    );
    // Add success notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        titulo: 'Reorden de inventario confirmada',
        mensaje: `Se solicitaron ${amount} unidades al proveedor de farmacia.`,
        tipo: 'exito',
        tiempo: 'Justo ahora',
        leido: false
      },
      ...prev
    ]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, leido: true } : n))
    );
  };

  return (
    <ClinicContext.Provider
      value={{
        patients,
        doctors,
        appointments,
        medications,
        facilities,
        selectedFacility,
        setSelectedFacility,
        activeView,
        setActiveView,
        addPatient,
        addAppointment,
        updateAppointmentStatus,
        reorderMedication,
        selectedPatientForAppointment,
        setSelectedPatientForAppointment,
        isQuickAppointmentOpen,
        setIsQuickAppointmentOpen,
        isSearchOpen,
        setIsSearchOpen,
        isThemeModalOpen,
        setIsThemeModalOpen,
        notifications,
        markNotificationAsRead
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
