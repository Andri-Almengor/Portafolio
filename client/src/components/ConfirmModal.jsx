import { useEffect } from 'react';
import { Icon } from './Icon.jsx';

export function ConfirmModal({
  open,
  title = 'Confirmar acción',
  description,
  confirmLabel = 'Eliminar',
  onConfirm,
  onCancel,
  busy = false
}) {
  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape' && !busy) onCancel();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#08080A]/85 p-4 backdrop-blur-md" role="presentation" onMouseDown={(e) => {
      if (e.target === e.currentTarget && !busy) onCancel();
    }}>
      <section className="w-full max-w-md rounded-xl border border-error/20 bg-surface-container-low p-6 shadow-glow" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-error/10 text-error">
          <Icon>delete_forever</Icon>
        </div>
        <h2 id="confirm-title" className="font-headline text-headline-md">{title}</h2>
        <p className="mt-2 text-on-surface-variant">{description}</p>
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={busy} className="rounded-lg border border-outline-variant/30 px-4 py-2 text-on-surface-variant hover:border-primary/40 hover:text-primary disabled:opacity-50">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className="rounded-lg bg-error-container px-4 py-2 font-semibold text-error disabled:opacity-50">
            {busy ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
