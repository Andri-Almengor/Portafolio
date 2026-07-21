import { Icon } from './Icon.jsx';

export function Toast({ message, tone = 'success', onClose }) {
  if (!message) return null;
  const isError = tone === 'error';
  return (
    <div className="fixed bottom-5 right-5 z-[100] max-w-[calc(100vw-2rem)] toast-in" role={isError ? 'alert' : 'status'}>
      <div className={`flex items-start gap-3 rounded-xl border bg-surface-container-high px-4 py-3 shadow-glow ${
        isError ? 'border-error/30 text-error' : 'border-primary/30 text-on-surface'
      }`}>
        <Icon className={isError ? 'text-error' : 'text-primary'}>
          {isError ? 'error' : 'check_circle'}
        </Icon>
        <p className="max-w-sm text-sm">{message}</p>
        {onClose && (
          <button className="ml-2 text-on-surface-variant hover:text-on-surface" onClick={onClose} type="button" aria-label="Cerrar mensaje">
            <Icon className="text-lg">close</Icon>
          </button>
        )}
      </div>
    </div>
  );
}
