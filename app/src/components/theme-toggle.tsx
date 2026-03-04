import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedTheme = theme ?? 'system';
  const selectedResolvedTheme = resolvedTheme ?? 'light';

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900">
      <span className="text-slate-600 dark:text-slate-300">Theme:</span>
      <select
        className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        value={selectedTheme}
        onChange={(event) => setTheme(event.target.value)}
        disabled={!mounted}
      >
        <option value="system">system</option>
        <option value="light">light</option>
        <option value="dark">dark</option>
      </select>
      <span className="text-xs text-slate-500 dark:text-slate-400">resolved: {selectedResolvedTheme}</span>
    </div>
  );
};
