export const productCardStyles = {
  surface:
    'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-none transition-[border-color,box-shadow] duration-200 ease-out hover:border-slate-300 hover:shadow-[0_12px_24px_-20px_rgba(15,23,42,0.35)]',
  link: 'flex flex-1 flex-col',
  imageWrap: 'relative flex aspect-square items-center justify-center overflow-hidden bg-slate-50 p-3',
  image: 'object-contain p-2',
  content: 'flex flex-1 flex-col gap-2.5 px-3 pb-3 pt-2.5',
  brand: 'truncate text-xs text-slate-500',
  name: 'line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-5 text-slate-900',
  rating: 'text-xs text-slate-500',
  priceRow: 'flex items-baseline gap-2',
  price: 'text-lg font-bold text-slate-900',
  oldPrice: 'text-xs text-slate-500 line-through',
  emptyPrice: 'text-xs italic text-slate-500',
  stockMeta: 'inline-flex items-center gap-1 text-xs text-slate-500',
  stockDot: 'h-1.5 w-1.5 rounded-full bg-green-700',
  stockDotMuted: 'h-1.5 w-1.5 rounded-full bg-slate-300',
  meta: 'text-xs text-slate-500',
  authPrompt:
    'inline-flex min-h-8 items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-xs font-medium text-primary transition-colors duration-200 hover:bg-primary/10',
  wishlistOverlay:
    'absolute right-2 top-2 z-10 !h-9 !w-9 !rounded-full !border !border-slate-200 !bg-white/95 !text-slate-600 backdrop-blur-sm hover:!border-slate-300 hover:!bg-white',
  actions: 'mt-auto flex items-center gap-2 px-3 pb-3 pt-1',
  primaryAction: '!h-10 w-full !rounded-lg text-sm font-semibold',
} as const
