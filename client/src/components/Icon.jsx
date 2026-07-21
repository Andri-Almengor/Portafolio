export function Icon({ children, className = '', filled = false, title }) {
  return (
    <span
      aria-hidden={title ? undefined : 'true'}
      className={`material-symbols-outlined ${filled ? 'material-symbols-filled' : ''} ${className}`}
      title={title}
    >
      {children}
    </span>
  );
}
