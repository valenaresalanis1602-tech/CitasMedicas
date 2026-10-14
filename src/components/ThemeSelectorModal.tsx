import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useClinic } from '../context/ClinicContext';
import { ColorTheme, DensityMode, FontFamily, ThemeMode } from '../types/clinic';
import { Check, Moon, Sun, Monitor, Type, Palette, Sparkles, X, Sliders } from 'lucide-react';

export const ThemeSelectorModal: React.FC = () => {
  const { isThemeModalOpen, setIsThemeModalOpen } = useClinic();
  const {
    mode,
    setMode,
    colorTheme,
    setColorTheme,
    fontFamily,
    setFontFamily,
    density,
    setDensity,
    colorDefinitions,
    fontDefinitions
  } = useTheme();

  if (!isThemeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 id="theme-modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
                Personalización Visual y Tipografía
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ajusta el modo de luz, paleta clínica y tipografía optimizada para lectura médica
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Modo Oscuro / Claro */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              Modo de Visualización
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Modo Claro', icon: Sun, desc: 'Óptimo para turnos diurnos' },
                { id: 'dark', label: 'Modo Oscuro', icon: Moon, desc: 'Reduce fatiga ocular en guardias' },
                { id: 'system', label: 'Automático', icon: Monitor, desc: 'Sigue la preferencia del SO' }
              ].map(opt => {
                const Icon = opt.icon;
                const isSelected = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setMode(opt.id as ThemeMode)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 ring-2 ring-teal-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-semibold">{opt.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Paletas de Colores Clínicos */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Paleta Cromática Clínica
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(colorDefinitions) as ColorTheme[]).map(themeKey => {
                const theme = colorDefinitions[themeKey];
                const isSelected = colorTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => setColorTheme(themeKey)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 dark:border-white bg-slate-100/80 dark:bg-slate-800/80 ring-2 ring-slate-400/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <span 
                      className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center shadow-xs" 
                      style={{ backgroundColor: theme.hex }}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{theme.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Tipografía Optimizada */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" />
                Tipografía de Interfaz Médica
              </label>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Google Fonts en vivo</span>
            </div>
            <div className="space-y-2">
              {(Object.keys(fontDefinitions) as FontFamily[]).map(fontKey => {
                const font = fontDefinitions[fontKey];
                const isSelected = fontFamily === fontKey;
                return (
                  <button
                    key={fontKey}
                    onClick={() => setFontFamily(fontKey)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 text-slate-900 dark:text-white ring-1 ring-teal-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{font.name}</span>
                        {fontKey === 'lexend' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                            Anti-fatiga
                          </span>
                        )}
                        {fontKey === 'jakarta' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-medium">
                            Recomendada
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{font.description}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">AaBb123</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Densidad de la interfaz */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Densidad de Pantalla
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDensity('comfortable')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  density === 'comfortable'
                    ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <p className="text-xs font-semibold">Cómoda (Estándar)</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Espaciado ergonómico para atención y recepción</p>
              </button>
              <button
                onClick={() => setDensity('compact')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  density === 'compact'
                    ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <p className="text-xs font-semibold">Compacta (Alta Densidad)</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Filas y formularios reducidos para mayor contenido</p>
              </button>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Previsualización en tiempo real
              </span>
              <span>Guardado automático</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs"
                  style={{ backgroundColor: colorDefinitions[colorTheme].hex }}
                >
                  MC
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Dra. Valeria Montes</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Cardiología · Consultorio 301 · 09:00 AM</p>
                </div>
              </div>
              <button
                style={{ backgroundColor: colorDefinitions[colorTheme].hex }}
                className="px-3 py-1.5 text-xs font-medium text-white rounded-lg shadow-xs"
              >
                Atender Cita
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Los ajustes se guardan automáticamente en tu navegador.
          </p>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Aplicar y Volver
          </button>
        </div>
      </div>
    </div>
  );
};
