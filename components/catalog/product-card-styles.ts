export const productCardStyles = {
  surface:
    'flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-none transition-colors duration-200 hover:border-slate-300',
  link: 'flex flex-1 flex-col',
  imageWrap: 'relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-50',
  image: 'object-contain p-3',
  content: 'flex flex-1 flex-col gap-2 px-3 pb-3 pt-2.5',
  brand: 'truncate text-xs text-slate-500',
  // 2.75rem keeps card heights aligned for two-line names with leading-5 text.
  name: 'line-clamp-2 min-h-[2.75rem] text-sm font-medium leading-5 text-slate-900',
  price: 'text-base font-bold text-slate-900',
  emptyPrice: 'text-xs italic text-slate-500',
  meta: 'text-xs text-slate-500',
  authPrompt:
    'inline-flex min-h-8 items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10',
  actions: 'flex items-center gap-2 px-3 pb-3 pt-0',
  quietAction: '!h-10 !rounded-lg !border !border-slate-200 !bg-white !text-slate-600 hover:!border-slate-300 hover:!bg-slate-50',
  primaryAction: '!h-10 !rounded-lg',
} as const
