import { useEffect, useState } from 'react';

export function TypewriterText({
  text,
  typingSpeed = 85,
  deletingSpeed = 42,
  pauseAfterTyping = 1800,
  pauseAfterDeleting = 450
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener?.('change', updatePreference);
    return () => mediaQuery.removeEventListener?.('change', updatePreference);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayedText(text);
      setDeleting(false);
      return undefined;
    }

    let delay = deleting ? deletingSpeed : typingSpeed;

    if (!deleting && displayedText === text) delay = pauseAfterTyping;
    if (deleting && displayedText === '') delay = pauseAfterDeleting;

    const timeout = window.setTimeout(() => {
      if (!deleting && displayedText === text) {
        setDeleting(true);
        return;
      }

      if (deleting && displayedText === '') {
        setDeleting(false);
        return;
      }

      const nextLength = displayedText.length + (deleting ? -1 : 1);
      setDisplayedText(text.slice(0, nextLength));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [
    displayedText,
    deleting,
    deletingSpeed,
    pauseAfterDeleting,
    pauseAfterTyping,
    reduceMotion,
    text,
    typingSpeed
  ]);

  return (
    <span className="typewriter-frame" aria-label={text}>
      <span className="typewriter-ghost" aria-hidden="true">{text}</span>
      <span className="typewriter-live" aria-hidden="true">
        {displayedText}
        <span className="typewriter-cursor">|</span>
      </span>
    </span>
  );
}
