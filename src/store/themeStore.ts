import { create } from 'zustand';

interface ThemeStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const loadTheme = (): boolean => {
  try {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error);
    return false;
  }
};

export const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: loadTheme(),
  toggleDarkMode: () => {
    set((state) => {
      const newMode = !state.isDarkMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      document.body.className = newMode ? 'dark-mode' : '';
      return { isDarkMode: newMode };
    });
  },
})); 