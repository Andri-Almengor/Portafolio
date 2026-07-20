import { useEffect, useRef } from 'react';

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export function TurnstileWidget({ onToken }) {
  const container = useRef(null);

  useEffect(() => {
    if (!siteKey || !container.current) return undefined;
    let widgetId;
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.turnstile || widgetId !== undefined) return;
      widgetId = window.turnstile.render(container.current, {
        sitekey: siteKey,
        callback: onToken,
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken('')
      });
    };

    let script = document.querySelector('script[data-turnstile-script]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.turnstileScript = 'true';
      script.addEventListener('load', render);
      document.head.appendChild(script);
    } else if (window.turnstile) {
      render();
    } else {
      script.addEventListener('load', render);
    }

    return () => {
      cancelled = true;
      script?.removeEventListener('load', render);
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken]);

  if (!siteKey) return null;
  return <div ref={container} />;
}
