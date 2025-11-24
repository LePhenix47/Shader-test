import { useAppStore } from '@/stores/useAppStore';

export function ThemeToggle() {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  return (
    <div className="theme-toggle">
      <label htmlFor="theme-select">Theme:</label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'system')}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>

      <div className="theme-buttons">
        <button
          onClick={() => handleThemeChange('light')}
          className={theme === 'light' ? 'active' : ''}
          aria-label="Light theme"
        >
          ☀️
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={theme === 'dark' ? 'active' : ''}
          aria-label="Dark theme"
        >
          🌙
        </button>
        <button
          onClick={() => handleThemeChange('system')}
          className={theme === 'system' ? 'active' : ''}
          aria-label="System theme"
        >
          💻
        </button>
      </div>
    </div>
  );
}
