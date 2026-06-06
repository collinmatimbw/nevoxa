/**
 * Extract initials from a full name.
 * "Collin Reynolds" → "CR"
 * "Alex" → "A"
 * "Mary Jane Watson" → "MW" (first + last)
 * "" → "?"
 */
export default function getInitials(name: string | undefined | null): string {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
