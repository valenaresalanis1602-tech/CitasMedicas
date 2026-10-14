import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Code2, 
  Copy, 
  Check, 
  FileCode, 
  Download, 
  ExternalLink, 
  Layers, 
  Palette, 
  Moon, 
  Type 
} from 'lucide-react';

export const PhpCodeView: React.FC = () => {
  const { colorTheme, colorDefinitions } = useTheme();
  const activeColor = colorDefinitions[colorTheme] || colorDefinitions.teal;

  const [activeTab, setActiveTab] = useState<'agendar' | 'dashboard' | 'themeScript' | 'headerPartial' | 'config'>('agendar');
  const [copied, setCopied] = useState(false);

  const PHP_FILES = {
    agendar: {
      name: 'agendar_cita.php',
      desc: 'Formulario moderno de 2 columnas con búsqueda en vivo, modo oscuro y temas dinámicos.',
      code: `<?php
/**
 * App Médica - Sistema Clínico Integral
 * Archivo: agendar_cita.php
 * Interfaz amigable con Modo Oscuro, Selector de Temas Dinámico y Tipografía Optimizada
 */
require_once 'includes/db_connect.php';
$pageTitle = "Agendar Nueva Cita y Gestión de Pacientes";
$activeNav = "agendar";

// Consulta de especialidades y médicos activos
$stmtEsp = $pdo->query("SELECT DISTINCT especialidad FROM medicos WHERE activo = 1 ORDER BY especialidad ASC");
$especialidades = $stmtEsp->fetchAll(PDO::FETCH_COLUMN);

$stmtMed = $pdo->query("SELECT id, nombre, especialidad, consultorio FROM medicos WHERE activo = 1 ORDER BY nombre ASC");
$medicos = $stmtMed->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle) ?> — App Médica</title>
  
  <!-- Tipografía Optimizada Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Outfit:wght@400;500;600&family=Lexend:wght@400;500;600&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN con soporte de Modo Oscuro -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            clinical: {
              50: 'var(--clinical-50, #f0fdfa)',
              500: 'var(--clinical-500, #14b8a6)',
              600: 'var(--clinical-600, #0d9488)',
              700: 'var(--clinical-700, #0f766e)',
            }
          }
        }
      }
    }
  </script>
  <link rel="stylesheet" href="assets/css/theme-engine.css">
  <script src="assets/js/theme-engine.js" defer></script>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200">

  <div class="flex min-h-screen">
    <!-- Sidebar Modular -->
    <?php include 'includes/sidebar.php'; ?>

    <div class="flex-1 flex flex-col min-w-0">
      <!-- Navbar / Header con Controles de Tema y Modo Oscuro -->
      <?php include 'includes/header.php'; ?>

      <!-- Contenedor Principal de Citas -->
      <main class="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        
        <!-- Migas de pan y encabezado -->
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            <span>CLÍNICA</span>
            <span>/</span>
            <span>GESTIÓN DE CITAS</span>
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Agendar Nueva Cita y Gestión de Pacientes
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Selecciona un paciente mediante el buscador predictivo o registra uno nuevo al instante.
          </p>
        </div>

        <!-- Rejilla de Dos Columnas Ergonómica -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Columna Izquierda: Datos de la Cita (7 cols) -->
          <div class="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div class="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span class="text-xl">📅</span>
              <div>
                <h2 class="text-sm font-bold text-slate-900 dark:text-white">Datos de la Cita</h2>
                <p class="text-xs text-slate-400">Asignación de turno, consultorio y médico</p>
              </div>
            </div>

            <form action="procesar_cita.php" method="POST" id="formCita" class="space-y-4">
              <!-- Buscador interactivo de pacientes -->
              <div class="relative">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Buscar y Seleccionar Paciente <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="buscarPacienteInput" 
                  autocomplete="off"
                  placeholder="Escribe el nombre, CURP o teléfono..."
                  class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/30"
                >
                <input type="hidden" name="paciente_id" id="pacienteIdHidden" required>
                <div id="resultadosPacientes" class="hidden absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-30 max-h-48 overflow-y-auto"></div>
              </div>

              <!-- Especialidad & Médico Asignado -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Especialidad</label>
                  <select name="especialidad" id="especialidadSelect" class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer" required>
                    <option value="">Seleccione una especialidad...</option>
                    <?php foreach ($especialidades as $esp): ?>
                      <option value="<?= htmlspecialchars($esp) ?>"><?= htmlspecialchars($esp) ?></option>
                    <?php endforeach; ?>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Médico Asignado</label>
                  <select name="medico_id" id="medicoSelect" class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer" required>
                    <option value="">Seleccione un médico...</option>
                    <?php foreach ($medicos as $m): ?>
                      <option value="<?= $m['id'] ?>" data-esp="<?= htmlspecialchars($m['especialidad']) ?>" data-room="<?= htmlspecialchars($m['consultorio']) ?>">
                        <?= htmlspecialchars($m['nombre']) ?> (<?= htmlspecialchars($m['consultorio']) ?>)
                      </option>
                    <?php endforeach; ?>
                  </select>
                </div>
              </div>

              <!-- Consultorio & Fecha de Cita -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Consultorio</label>
                  <input type="text" id="consultorioInput" name="consultorio" readonly class="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 cursor-not-allowed">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Fecha de Cita</label>
                  <input type="date" name="fecha_cita" value="<?= date('Y-m-d') ?>" class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono cursor-pointer" required>
                </div>
              </div>

              <!-- Horario / Turno -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Hora de Inicio</label>
                <select name="hora_cita" class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono cursor-pointer" required>
                  <option value="08:30:00">08:30 hrs</option>
                  <option value="09:00:00" selected>09:00 hrs</option>
                  <option value="09:30:00">09:30 hrs</option>
                  <option value="10:00:00">10:00 hrs</option>
                  <option value="10:30:00">10:30 hrs</option>
                  <option value="11:00:00">11:00 hrs</option>
                  <option value="11:30:00">11:30 hrs</option>
                  <option value="12:00:00">12:00 hrs</option>
                  <option value="16:00:00">16:00 hrs</option>
                  <option value="16:30:00">16:30 hrs</option>
                </select>
              </div>

              <!-- Motivo de la Consulta -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Motivo de la Consulta</label>
                <textarea name="motivo" rows="3" placeholder="Describe brevemente el motivo de la visita..." class="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"></textarea>
              </div>

              <!-- Botones de Acción -->
              <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button type="reset" class="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancelar</button>
                <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-xl shadow-xs transition-colors">Guardar Cita</button>
              </div>
            </form>
          </div>

          <!-- Columna Derecha: Registrar Nuevo Paciente (5 cols) -->
          <div class="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div class="flex items-center gap-2.5 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span class="text-xl">👤</span>
              <div>
                <h2 class="text-sm font-bold text-slate-900 dark:text-white">Registrar Nuevo Paciente</h2>
                <p class="text-xs text-slate-400">Alta rápida en el padrón clínico</p>
              </div>
            </div>

            <!-- Banner amigable -->
            <div class="p-3 mb-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/60 text-xs text-teal-800 dark:text-teal-200">
              💡 ¿El paciente no aparece en el buscador de la izquierda? Regístralo aquí al instante para poder agendar su cita de inmediato.
            </div>

            <form action="ajax_registrar_paciente.php" method="POST" id="formNuevoPaciente" class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre(s) *</label>
                <input type="text" name="nombre" required class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Apellido Paterno *</label>
                  <input type="text" name="apellido_paterno" required class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Apellido Materno</label>
                  <input type="text" name="apellido_materno" class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Fecha Nacimiento</label>
                  <input type="date" name="fecha_nacimiento" value="2000-01-01" class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Género</label>
                  <select name="genero" class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white">
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">CURP (18 caract.)</label>
                <input type="text" name="curp" maxlength="18" placeholder="EJ. AAAA000000HXXXXX00" class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono uppercase">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Teléfono (10 dígitos) *</label>
                <input type="tel" name="telefono" required placeholder="7771234567" class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
                <input type="email" name="correo" placeholder="correo@ejemplo.com" class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white">
              </div>

              <div class="pt-2">
                <button type="submit" class="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-xl hover:bg-slate-800 transition-colors">
                  Registrar Paciente
                </button>
              </div>
            </form>
          </div>

        </div>

      </main>
    </div>
  </div>

</body>
</html>`
    },
    dashboard: {
      name: 'dashboard.php',
      desc: 'Panel general con banner en vivo, KPIs con números tabulares y alertas de stock de farmacia.',
      code: `<?php
/**
 * App Médica - Sistema Clínico Integral
 * Archivo: dashboard.php
 * Panel Administrativo con métricas en tiempo real y alertas de inventario
 */
require_once 'includes/db_connect.php';
$pageTitle = "Panel Administrativo — Clínica Central";
$activeNav = "dashboard";

// Consultas estadísticas de la jornada
$hoy = date('Y-m-d');

$stmtPacientes = $pdo->query("SELECT COUNT(*) FROM pacientes");
$totalPacientes = $stmtPacientes->fetchColumn() ?: 60;

$stmtCitas = $pdo->prepare("SELECT COUNT(*) FROM citas WHERE DATE(fecha_cita) = :hoy");
$stmtCitas->execute(['hoy' => $hoy]);
$citasHoy = $stmtCitas->fetchColumn() ?: 0;

$stmtVentas = $pdo->prepare("SELECT COALESCE(SUM(total), 0) FROM ventas WHERE DATE(fecha) = :hoy");
$stmtVentas->execute(['hoy' => $hoy]);
$totalVentas = $stmtVentas->fetchColumn() ?: 0.00;

$stmtStock = $pdo->query("SELECT COALESCE(SUM(stock), 0) FROM medicamentos");
$totalStock = $stmtStock->fetchColumn() ?: 3416;

// Alertas críticas de medicamentos con stock menor a 15 unidades
$stmtAlertas = $pdo->query("SELECT id, nombre, stock, stock_minimo FROM medicamentos WHERE stock <= 15 ORDER BY stock ASC");
$alertasStock = $stmtAlertas->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle) ?> — App Médica</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Lexend:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config = { darkMode: 'class' };</script>
  <link rel="stylesheet" href="assets/css/theme-engine.css">
  <script src="assets/js/theme-engine.js" defer></script>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200">

  <div class="flex min-h-screen">
    <?php include 'includes/sidebar.php'; ?>

    <div class="flex-1 flex flex-col min-w-0">
      <?php include 'includes/header.php'; ?>

      <main class="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        
        <!-- Banner de Base de Datos Sincronizada EN VIVO -->
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">✓</span>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-900 dark:text-white">Base de datos sincronizada</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold uppercase">EN VIVO</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <?= (int)$citasHoy ?> citas registradas para la jornada de hoy. Datos leídos directamente de <code class="font-mono text-slate-700 dark:text-slate-300">app_medica_citas</code>.
              </p>
            </div>
          </div>
          <a href="reportes.php" class="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">Ver reporte →</a>
        </div>

        <!-- Encabezado de la Clínica -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="text-[11px] font-semibold tracking-wider uppercase text-teal-600 dark:text-teal-400">
              SEDE PRINCIPAL · Torre Médica A — Piso 3
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              Panel Administrativo — Clínica Central
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Resumen operativo general de atención a pacientes, farmacia activa y asignación de consultorios.
            </p>
          </div>
          <a href="agendar_cita.php" class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors">
            + Nueva Cita Rápida
          </a>
        </div>

        <!-- 4 Tarjetas de Métricas KPI -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span class="text-[11px] font-bold uppercase text-slate-400">Pacientes Registrados</span>
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
              <?= number_format($totalPacientes) ?>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Total en Pacientes</p>
          </div>

          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span class="text-[11px] font-bold uppercase text-slate-400">Citas de la Jornada</span>
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
              <?= (int)$citasHoy ?>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">0 listas · 0 espera · 0 canc.</p>
          </div>

          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span class="text-[11px] font-bold uppercase text-slate-400">Facturación del Día</span>
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
              $<?= number_format($totalVentas, 2) ?>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Suma de Venta.total de hoy</p>
          </div>

          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span class="text-[11px] font-bold uppercase text-slate-400">Stock Medicamentos</span>
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
              <?= number_format($totalStock) ?>
            </div>
            <p class="text-xs text-rose-600 dark:text-rose-400 font-medium mt-2">
              <?= count($alertasStock) ?> lote(s) por vencer/reordenar
            </p>
          </div>

        </div>

        <!-- Alertas Críticas de Inventario (Menor a 15 u.) -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-amber-500">⚠️</span>
              <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Alertas Críticas de Inventario</h2>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-medium">Menor a 15 u.</span>
            </div>
            <a href="inventario.php" class="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">Ir a Gestión de Inventario →</a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <?php foreach ($alertasStock as $med): ?>
              <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <p class="text-xs font-bold text-slate-900 dark:text-white"><?= htmlspecialchars($med['nombre']) ?></p>
                  <p class="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-0.5 font-mono">
                    <?= (int)$med['stock'] ?> unidades restantes
                  </p>
                </div>
                <a href="reordenar.php?id=<?= $med['id'] ?>" class="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100">
                  Reordenar
                </a>
              </div>
            <?php endforeach; ?>
          </div>
        </div>

      </main>
    </div>
  </div>

</body>
</html>`
    },
    themeScript: {
      name: 'theme-engine.js',
      desc: 'Motor cliente Vanilla JS para modo oscuro, persistencia en localStorage y cambio dinámico de paleta y tipografía.',
      code: `/**
 * Theme Engine - Modo Oscuro & Selector de Temas Dinámico
 * Guardar en: assets/js/theme-engine.js
 * Compatible con cualquier servidor PHP (Apache / Nginx / XAMPP)
 */
(function() {
  const THEME_KEY = 'app_medica_theme_mode';
  const COLOR_KEY = 'app_medica_color_theme';
  const FONT_KEY  = 'app_medica_font_family';

  const COLOR_PALETTES = {
    teal: {
      50: '#f0fdfa',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e'
    },
    blue: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    },
    emerald: {
      50: '#ecfdf5',
      500: '#10b981',
      600: '#059669',
      700: '#047857'
    },
    violet: {
      50: '#faf5ff',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9'
    },
    amber: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309'
    }
  };

  const FONTS = {
    jakarta: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    outfit: "'Outfit', system-ui, -apple-system, sans-serif",
    lexend: "'Lexend', system-ui, -apple-system, sans-serif",
    manrope: "'Manrope', system-ui, -apple-system, sans-serif"
  };

  function applyTheme() {
    const root = document.documentElement;
    const mode = localStorage.getItem(THEME_KEY) || 'light';
    const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Toggle clase dark en <html>
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Paleta de Color Dinámica
    const activeColor = localStorage.getItem(COLOR_KEY) || 'teal';
    const palette = COLOR_PALETTES[activeColor] || COLOR_PALETTES.teal;
    root.style.setProperty('--clinical-50', palette[50]);
    root.style.setProperty('--clinical-500', palette[500]);
    root.style.setProperty('--clinical-600', palette[600]);
    root.style.setProperty('--clinical-700', palette[700]);

    // Tipografía Optimizada
    const activeFont = localStorage.getItem(FONT_KEY) || 'jakarta';
    document.body.style.fontFamily = FONTS[activeFont] || FONTS.jakarta;
  }

  // Ejecutar inmediatamente para evitar parpadeos (FOUC)
  applyTheme();

  // Exponer API global para los botones del header
  window.AppMedicaTheme = {
    toggleDarkMode: function() {
      const current = localStorage.getItem(THEME_KEY) || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme();
    },
    setColor: function(colorName) {
      if (COLOR_PALETTES[colorName]) {
        localStorage.setItem(COLOR_KEY, colorName);
        applyTheme();
      }
    },
    setFont: function(fontKey) {
      if (FONTS[fontKey]) {
        localStorage.setItem(FONT_KEY, fontKey);
        applyTheme();
      }
    }
  };
})();`
    },
    headerPartial: {
      name: 'includes/header.php',
      desc: 'Barra superior con selector de sedes, botón de nueva cita, perfil y disparador de modo oscuro.',
      code: `<!-- Header Reutilizable: includes/header.php -->
<header class="sticky top-0 z-20 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between gap-4 transition-colors">
  
  <!-- Sede Hospitalaria -->
  <div class="flex items-center gap-3">
    <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200">
      <span>🏥 Sede Central — Torre Médica A</span>
    </div>
    <div class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
      <span>Online / DB Sincronizada</span>
    </div>
  </div>

  <!-- Controles Derecha: Modo Oscuro, Temas, Perfil & CTA -->
  <div class="flex items-center gap-3">
    
    <!-- Botón Modo Oscuro -->
    <button onclick="window.AppMedicaTheme.toggleDarkMode()" class="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700" title="Cambiar Modo Oscuro / Claro">
      <span class="dark:hidden">🌙</span>
      <span class="hidden dark:inline">☀️</span>
    </button>

    <!-- Botón Nueva Cita -->
    <a href="agendar_cita.php" class="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors">
      <span>+ Nueva Cita</span>
    </a>

    <!-- Notificación -->
    <div class="relative">
      <span class="p-2 text-slate-500 hover:text-slate-700 cursor-pointer text-sm">🔔</span>
      <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
    </div>

    <!-- Perfil del Doctor / Administrador -->
    <div class="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
      <div class="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
        VM
      </div>
      <div class="hidden sm:block text-left text-xs">
        <p class="font-bold text-slate-900 dark:text-white leading-tight">Dra. Valeria Montes</p>
        <p class="text-[10px] text-slate-400 leading-tight">Administrador Clínico</p>
      </div>
    </div>

  </div>
</header>`
    },
    config: {
      name: 'includes/db_connect.php',
      desc: 'Conexión PDO segura con UTF-8 y manejo de excepciones.',
      code: `<?php
/**
 * Conexión a Base de Datos MySQL / MariaDB
 * Archivo: includes/db_connect.php
 */
$host = 'localhost';
$db   = 'app_medica_citas';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("Error al conectar con la base de datos de App Médica: " . $e->getMessage());
}
?>`
    }
  };

  const handleCopy = () => {
    const text = PHP_FILES[activeTab].code;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div 
              className="p-3 rounded-xl text-white shadow-xs shrink-0"
              style={{ backgroundColor: activeColor.hex }}
            >
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Código Fuente PHP Modernizado
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  PHP 8.x + Tailwind
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Archivos completos listos para copiar y reemplazar en tu servidor local XAMPP/WAMP o hosting PHP (<code className="font-mono text-slate-700 dark:text-slate-300">localhost/AppCitasMedicas/</code>).
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>¡Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Archivo Actual</span>
              </>
            )}
          </button>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Moon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Modo Oscuro sin parpadeo</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Palette className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>5 Paletas cromáticas CSS</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Type className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Tipografía médica anti-fatiga</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Partials PHP modulares</span>
          </div>
        </div>
      </div>

      {/* Code File Explorer Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {/* File Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {(Object.keys(PHP_FILES) as Array<keyof typeof PHP_FILES>).map(key => {
            const file = PHP_FILES[key];
            const isSelected = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setCopied(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab description */}
        <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>{PHP_FILES[activeTab].desc}</p>
          <span className="font-mono text-[11px] text-slate-400">
            {PHP_FILES[activeTab].code.split('\n').length} líneas
          </span>
        </div>

        {/* Code View Area with Monospace Tabular font */}
        <div className="relative">
          <pre className="p-5 overflow-x-auto text-xs font-mono leading-relaxed bg-slate-950 text-slate-200 max-h-[550px] selection:bg-teal-500/30 selection:text-white">
            <code>{PHP_FILES[activeTab].code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
