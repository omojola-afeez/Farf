import { solarIcons } from '@/lib/solarIcons';

// Inline Solar icons. Colour follows the surrounding text colour.
export default function Icon({ name, className = 'h-6 w-6' }) {
  const body = solarIcons[name];
  if (!body) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
