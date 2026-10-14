import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import { Medication } from '../types/clinic';
import {
  Package,
  AlertTriangle,
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingDown,
  Check
} from 'lucide-react';

export const InventarioView: React.FC = () => {
  const { medications, reorderMedication } = useClinic();
  const { colorTheme, colorDefinitions } = useTheme();
  const activeColor = colorDefinitions[colorTheme] || colorDefinitions.teal;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<'Todos' | 'Agotado' | 'Bajo' | 'Normal'>('Todos');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredMeds = medications.filter(m => {
    const matchesSearch =
      m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.lote.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = filterState === 'Todos' || m.estado === filterState;
    return matchesSearch && matchesState;
  });

  const handleReorder = (m: Medication) => {
    reorderMedication(m.id, 50);
    setSuccessToast(`Pedido de ${m.nombre} solicitado con éxito (+50 unidades).`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const totalUnits = medications.reduce((acc, m) => acc + m.stock, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-teal-600 dark:text-teal-400">
            FARMACIA & OPERACIONES / INVENTARIO
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Inventario Clínico y Medicamentos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Control de existencias, fechas de caducidad, lotes y abastecimiento crítico.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono">
            <span className="text-slate-400">Stock Total:</span>{' '}
            <strong className="text-slate-900 dark:text-white">{totalUnits.toLocaleString()} u.</strong>
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por fármaco o lote..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30"
          />
        </div>

        {/* State filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          {(['Todos', 'Agotado', 'Bajo', 'Normal'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterState(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterState === st
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Medicamento / Presentación</th>
                <th className="px-4 py-3.5 font-semibold">Lote & Caducidad</th>
                <th className="px-4 py-3.5 font-semibold text-right">Existencias</th>
                <th className="px-4 py-3.5 font-semibold">Estado</th>
                <th className="px-4 py-3.5 font-semibold text-right">Precio</th>
                <th className="px-5 py-3.5 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {filteredMeds.map(med => (
                <tr key={med.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white">
                    <p className="font-bold">{med.nombre}</p>
                    <p className="text-[11px] text-slate-400">{med.concentracion} · {med.unidad}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300">
                    <p>{med.lote}</p>
                    <p className="text-[10px] text-slate-400">Vence: {med.fechaCaducidad}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-right font-bold tabular-nums text-slate-900 dark:text-white">
                    {med.stock} u.
                    <span className="block text-[10px] font-normal text-slate-400">Mín: {med.stockMinimo}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    {med.estado === 'Agotado' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        Agotado
                      </span>
                    )}
                    {med.estado === 'Bajo' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        Stock Bajo
                      </span>
                    )}
                    {med.estado === 'Normal' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Disponible
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-right tabular-nums text-slate-700 dark:text-slate-300 font-semibold">
                    ${med.precioVenta.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleReorder(med)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer"
                    >
                      Reordenar +50
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
