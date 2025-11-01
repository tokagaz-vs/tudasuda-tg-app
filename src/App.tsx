import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useTelegram } from './hooks/useTelegram';
import { HomePage } from './pages/HomePage';

function AppContent() {
  const { theme } = useTheme();
  const { webApp } = useTelegram();

  useEffect(() => {
    webApp.ready();
    webApp.expand();
    
    // Настройка цветов под тему Telegram
    if (theme.colors.background.startsWith('#')) {
      webApp.setHeaderColor(theme.colors.background as `#${string}`);
      webApp.setBackgroundColor(theme.colors.background as `#${string}`);
    }
  }, [webApp, theme]);

  return (
    <div style={{ 
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
      color: theme.colors.text,
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;