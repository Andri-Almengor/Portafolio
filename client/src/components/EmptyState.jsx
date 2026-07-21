import { Icon } from './Icon.jsx';

export function EmptyState({ icon = 'folder_open', title, description, action }) {
  return (
    <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="text-3xl">{icon}</Icon>
      </div>
      <h2 className="font-headline text-headline-md text-on-surface">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-xl text-on-surface-variant">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
