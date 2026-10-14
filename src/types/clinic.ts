export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorTheme = 'teal' | 'blue' | 'emerald' | 'violet' | 'amber' | 'slate';

export type FontFamily = 'jakarta' | 'outfit' | 'lexend' | 'manrope' | 'dmsans';

export type DensityMode = 'comfortable' | 'compact';

export interface Patient {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  curp: string;
  telefono: string;
  correo: string;
  fechaRegistro: string;
  alergias?: string;
  tipoSangre?: string;
}

export interface Doctor {
  id: string;
  nombre: string;
  especialidad: string;
  cedula: string;
  consultorio: string;
  telefono: string;
  correo: string;
  horario: string;
  disponible: boolean;
}

export interface Appointment {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteTelefono: string;
  pacienteCurp: string;
  especialidad: string;
  medicoId: string;
  medicoNombre: string;
  consultorio: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'Pendiente' | 'Confirmada' | 'En Espera' | 'En Consulta' | 'Completada' | 'Cancelada';
  costo: number;
  creadoEn: string;
}

export interface Medication {
  id: string;
  nombre: string;
  concentracion: string;
  stock: number;
  stockMinimo: number;
  unidad: string;
  lote: string;
  fechaCaducidad: string;
  precioVenta: number;
  estado: 'Normal' | 'Bajo' | 'Agotado';
}

export interface Facility {
  id: string;
  nombre: string;
  edificio: string;
  piso: string;
  direccion: string;
}
