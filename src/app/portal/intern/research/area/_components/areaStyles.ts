/**
 * Per-area accent styling for the research area card grid. Each area gets
 * its own hue so the grid reads as a small map of distinct domains rather
 * than a uniform list — literal Tailwind class strings throughout (never
 * built by concatenation) so the JIT compiler picks them up.
 */
export interface AreaStyle {
  chip: string; // icon chip, unselected
  chipSelected: string; // icon chip, selected
  cardHover: string; // card border/bg on hover, unselected
  cardSelected: string; // card border/bg/ring, selected
  labelSelected: string; // label text color, selected
}

const DEFAULT_STYLE: AreaStyle = {
  chip: 'bg-gray-50 border-gray-100 text-gray-600',
  chipSelected: 'bg-gray-600 border-gray-600 text-white',
  cardHover: 'hover:border-gray-300 hover:bg-gray-50/60',
  cardSelected: 'border-gray-600 bg-gray-50 ring-2 ring-gray-200',
  labelSelected: 'text-gray-900',
};

export const AREA_STYLES: Record<string, AreaStyle> = {
  'quantum-computing': {
    chip: 'bg-violet-50 border-violet-100 text-violet-600',
    chipSelected: 'bg-violet-600 border-violet-600 text-white',
    cardHover: 'hover:border-violet-300 hover:bg-violet-50/60',
    cardSelected: 'border-violet-600 bg-violet-50 ring-2 ring-violet-200',
    labelSelected: 'text-violet-900',
  },
  'ai-ml': {
    chip: 'bg-indigo-50 border-indigo-100 text-indigo-600',
    chipSelected: 'bg-indigo-600 border-indigo-600 text-white',
    cardHover: 'hover:border-indigo-300 hover:bg-indigo-50/60',
    cardSelected: 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200',
    labelSelected: 'text-indigo-900',
  },
  'cyber-security': {
    chip: 'bg-rose-50 border-rose-100 text-rose-600',
    chipSelected: 'bg-rose-600 border-rose-600 text-white',
    cardHover: 'hover:border-rose-300 hover:bg-rose-50/60',
    cardSelected: 'border-rose-600 bg-rose-50 ring-2 ring-rose-200',
    labelSelected: 'text-rose-900',
  },
  'cloud-computing': {
    chip: 'bg-sky-50 border-sky-100 text-sky-600',
    chipSelected: 'bg-sky-600 border-sky-600 text-white',
    cardHover: 'hover:border-sky-300 hover:bg-sky-50/60',
    cardSelected: 'border-sky-600 bg-sky-50 ring-2 ring-sky-200',
    labelSelected: 'text-sky-900',
  },
  'data-science': {
    chip: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    chipSelected: 'bg-emerald-600 border-emerald-600 text-white',
    cardHover: 'hover:border-emerald-300 hover:bg-emerald-50/60',
    cardSelected: 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200',
    labelSelected: 'text-emerald-900',
  },
  iot: {
    chip: 'bg-amber-50 border-amber-100 text-amber-600',
    chipSelected: 'bg-amber-600 border-amber-600 text-white',
    cardHover: 'hover:border-amber-300 hover:bg-amber-50/60',
    cardSelected: 'border-amber-600 bg-amber-50 ring-2 ring-amber-200',
    labelSelected: 'text-amber-900',
  },
  robotics: {
    chip: 'bg-slate-50 border-slate-100 text-slate-600',
    chipSelected: 'bg-slate-600 border-slate-600 text-white',
    cardHover: 'hover:border-slate-300 hover:bg-slate-50/60',
    cardSelected: 'border-slate-600 bg-slate-50 ring-2 ring-slate-200',
    labelSelected: 'text-slate-900',
  },
  biotech: {
    chip: 'bg-teal-50 border-teal-100 text-teal-600',
    chipSelected: 'bg-teal-600 border-teal-600 text-white',
    cardHover: 'hover:border-teal-300 hover:bg-teal-50/60',
    cardSelected: 'border-teal-600 bg-teal-50 ring-2 ring-teal-200',
    labelSelected: 'text-teal-900',
  },
  'emerging-technology': {
    chip: 'bg-fuchsia-50 border-fuchsia-100 text-fuchsia-600',
    chipSelected: 'bg-fuchsia-600 border-fuchsia-600 text-white',
    cardHover: 'hover:border-fuchsia-300 hover:bg-fuchsia-50/60',
    cardSelected: 'border-fuchsia-600 bg-fuchsia-50 ring-2 ring-fuchsia-200',
    labelSelected: 'text-fuchsia-900',
  },
};

export function getAreaStyle(key: string): AreaStyle {
  return AREA_STYLES[key] || DEFAULT_STYLE;
}
