import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorTheme, DensityMode, FontFamily, ThemeMode } from '../types/clinic';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colorTheme: ColorTheme;
  fontFamily: FontFamily;
  density: DensityMode;
  setMode: (mode: ThemeMode) => void;
  setColorTheme: (color: ColorTheme) => void;
  setFontFamily: (font: FontFamily) => void;
  setDensity: (density: DensityMode) => void;
  toggleDark: () => void;
  colorDefinitions: Record<ColorTheme, { name: string; hex: string; classText: string; classBg: string; borderClass: string }>;
  fontDefinitions: Record<FontFamily, { name: string; description: string; sample: string }>;
}

const COLOR_DEFS: Record<ColorTheme, { name: string; hex: string; classText: string; classBg: string; borderClass: string; vars: Record<string, string> }> = {
  teal: {
    name: 'Turquesa Clínico',
    hex: '#0D9488',
    classText: 'text-teal-600 dark:text-teal-400',
    classBg: 'bg-teal-600 hover:bg-teal-700 text-white',
    borderClass: 'border-teal-500',
    vars: {
      '--primary-50': '#f0fdfa',
      '--primary-100': '#ccfbf1',
      '--primary-500': '#14b8a6',
      '--primary-600': '#0d9488',
      '--primary-700': '#0f766e',
      '--primary-ring': 'rgba(13, 148, 136, 0.25)'
    }
  },
  blue: {
    name: 'Azul Hospitalario',
    hex: '#2563EB',
    classText: 'text-blue-600 dark:text-blue-400',
    classBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    borderClass: 'border-blue-500',
    vars: {
      '--primary-50': '#eff6ff',
      '--primary-100': '#dbeafe',
      '--primary-500': '#3b82f6',
      '--primary-600': '#2563eb',
      '--primary-700': '#1d4ed8',
      '--primary-ring': 'rgba(37, 99, 235, 0.25)'
    }
  },
  emerald: {
    name: 'Esmeralda Vital',
    hex: '#059669',
    classText: 'text-emerald-600 dark:text-emerald-400',
    classBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    borderClass: 'border-emerald-500',
    vars: {
      '--primary-50': '#ecfdf5',
      '--primary-100': '#d1fae5',
      '--primary-500': '#10b981',
      '--primary-600': '#059669',
      '--primary-700': '#047857',
      '--primary-ring': 'rgba(5, 150, 105, 0.25)'
    }
  },
  violet: {
    name: 'Violeta Especializado',
    hex: '#7C3AED',
    classText: 'text-purple-600 dark:text-purple-400',
    classBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    borderClass: 'border-purple-500',
    vars: {
      '--primary-50': '#faf5ff',
      '--primary-100': '#f3e8ff',
      '--primary-500': '#8b5cf6',
      '--primary-600': '#7c3aed',
      '--primary-700': '#6d28d9',
      '--primary-ring': 'rgba(124, 58, 237, 0.25)'
    }
  },
  amber: {
    name: 'Ámbar Asistencial',
    hex: '#D97706',
    classText: 'text-amber-600 dark:text-amber-400',
    classBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    borderClass: 'border-amber-500',
    vars: {
      '--primary-50': '#fffbeb',
      '--primary-100': '#fef3c7',
      '--primary-500': '#f59e0b',
      '--primary-600': '#d97706',
      '--primary-700': '#b45309',
      '--primary-ring': 'rgba(217, 119, 6, 0.25)'
    }
  },
  slate: {
    name: 'Grafito Clínico Pro',
    hex: '#334155',
    classText: 'text-slate-700 dark:text-slate-300',
    classBg: 'bg-slate-800 hover:bg-slate-900 text-white',
    borderClass: 'border-slate-600',
    vars: {
      '--primary-50': '#f8fafc',
      '--primary-100': '#f1f5f9',
      '--primary-500': '#64748b',
      '--primary-600': '#475569',
      '--primary-700': '#334155',
      '--primary-ring': 'rgba(71, 85, 105, 0.25)'
    }
  }
};

const FONT_DEFS: Record<FontFamily, { name: string; description: string; sample: string; cssFamily: string }> = {
  jakarta: {
    name: 'Plus Jakarta Sans',
    description: 'Moderna, equilibrada y ultra nítida en pantallas médicas.',
    sample: 'Clínica Central · Dra. Valeria Montes',
    cssFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
  },
  outfit: {
    name: 'Outfit',
    description: 'Geométrica con curvas suaves y enfoque amigable al paciente.',
    sample: 'Agendar Cita · Gestión Humanizada',
    cssFamily: "'Outfit', system-ui, -apple-system, sans-serif"
  },
  lexend: {
    name: 'Lexend',
    description: 'Diseñada científicamente para reducir la fatiga visual en expedientes.',
    sample: 'Historial Clínico · Diagnóstico Inmediato',
    cssFamily: "'Lexend', system-ui, -apple-system, sans-serif"
  },
  manrope: {
    name: 'Manrope',
    description: 'Humanista contemporánea con proporciones claras para datos clínicos.',
    sample: 'Prescripción Médica · Consultorios',
    cssFamily: "'Manrope', system-ui, -apple-system, sans-serif"
  },
  dmsans: {
    name: 'DM Sans',
    description: 'Alta legibilidad en textos pequeños, etiquetas y tablas numéricas.',
    sample: 'Fármacos & Lotes · 3,416 unidades',
    cssFamily: "'DM Sans', system-ui, -apple-system, sans-serif"
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_medica_theme_mode') as ThemeMode;
      if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    }
    return 'light';
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('app_medica_color_theme') as ColorTheme) || 'teal';
    }
    return 'teal';
  });

  const [fontFamily, setFontFamilyState] = useState<FontFamily>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('app_medica_font_family') as FontFamily) || 'jakarta';
    }
    return 'jakarta';
  });

  const [density, setDensityState] = useState<DensityMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('app_medica_density') as DensityMode) || 'comfortable';
    }
    return 'comfortable';
  });

  const [systemIsDark, setSystemIsDark] = useState(() => {
    return typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
  });

  // Track system preference change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Calculate resolved dark state
  const isDark = mode === 'dark' || (mode === 'system' && systemIsDark);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Toggle dark class on both root html and body
    if (isDark) {
      root.classList.add('dark');
      body?.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      body?.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    // Set font family CSS variable
    const fontConfig = FONT_DEFS[fontFamily] || FONT_DEFS.jakarta;
    root.style.setProperty('--font-family', fontConfig.cssFamily);
    if (body) body.style.fontFamily = fontConfig.cssFamily;

    // Set color theme variables
    const colorConfig = COLOR_DEFS[colorTheme] || COLOR_DEFS.teal;
    Object.entries(colorConfig.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  }, [isDark, fontFamily, colorTheme]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('app_medica_theme_mode', newMode);
  };

  const toggleDark = () => {
    // If currently dark, switch to light. If currently light, switch to dark.
    const nextMode: ThemeMode = isDark ? 'light' : 'dark';
    setMode(nextMode);
  };

  const setColorTheme = (newColor: ColorTheme) => {
    setColorThemeState(newColor);
    localStorage.setItem('app_medica_color_theme', newColor);
  };

  const setFontFamily = (newFont: FontFamily) => {
    setFontFamilyState(newFont);
    localStorage.setItem('app_medica_font_family', newFont);
  };

  const setDensity = (newDensity: DensityMode) => {
    setDensityState(newDensity);
    localStorage.setItem('app_medica_density', newDensity);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        isDark,
        colorTheme,
        fontFamily,
        density,
        setMode,
        setColorTheme,
        setFontFamily,
        setDensity,
        toggleDark,
        colorDefinitions: COLOR_DEFS,
        fontDefinitions: FONT_DEFS
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
