/**
 * Format a number with locale-specific formatting
 */
export function formatNumber(
  value: number,
  options: {
    format?: 'decimal' | 'currency' | 'percent' | 'scientific';
    currency?: string;
    decimals?: number;
    locale?: string;
    showPositiveSign?: boolean;
  } = {}
): string {
  const {
    format = 'decimal',
    currency = 'USD',
    decimals = 2,
    locale = 'en-US',
    showPositiveSign = false,
  } = options;

  let formatted: string;

  switch (format) {
    case 'currency':
      formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
      break;

    case 'percent':
      formatted = new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
      break;

    case 'scientific':
      formatted = value.toExponential(decimals);
      break;

    case 'decimal':
    default:
      formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
      break;
  }

  if (showPositiveSign && value > 0 && !formatted.startsWith('+')) {
    formatted = '+' + formatted;
  }

  return formatted;
}

/**
 * Format a date with locale-specific formatting
 */
export function formatDate(
  value: Date | string | number,
  options: {
    format?: 'short' | 'medium' | 'long' | 'full' | string;
    locale?: string;
    includeTime?: boolean;
    relative?: boolean;
  } = {}
): string {
  const { format = 'medium', locale = 'en-US', includeTime = false, relative = false } = options;

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  if (relative) {
    return formatRelativeTime(date, locale);
  }

  let dateStyle: 'short' | 'medium' | 'long' | 'full' | undefined;
  let timeStyle: 'short' | 'medium' | 'long' | 'full' | undefined;

  if (['short', 'medium', 'long', 'full'].includes(format)) {
    dateStyle = format as 'short' | 'medium' | 'long' | 'full';
    timeStyle = includeTime ? dateStyle : undefined;
  }

  if (dateStyle) {
    return new Intl.DateTimeFormat(locale, {
      dateStyle,
      timeStyle,
    }).format(date);
  }

  // Custom format string (simplified - you might want to use a library like date-fns for complex formats)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: includeTime ? '2-digit' : undefined,
    minute: includeTime ? '2-digit' : undefined,
  }).format(date);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date, locale: string = 'en-US'): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const intervals: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      return rtf.format(diffInSeconds > 0 ? -count : count, interval.unit);
    }
  }

  return rtf.format(0, 'second');
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Transform text case
 */
export function transformText(
  text: string,
  transform?: 'uppercase' | 'lowercase' | 'capitalize'
): string {
  if (!transform) return text;

  switch (transform) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'capitalize':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    default:
      return text;
  }
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate a color from a string (for avatars)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 65%, 50%)`;
}

/**
 * Deep get value from object by path
 */
export function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Check if value is empty
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
