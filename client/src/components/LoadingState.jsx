export function LoadingState({ label = 'Cargando información...' }) {
  return (
    <div className="mx-auto flex min-h-[45vh] max-w-[1280px] items-center justify-center px-4" role="status">
      <div className="flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low px-5 py-4 text-on-surface-variant">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <span>{label}</span>
      </div>
    </div>
  );
}
