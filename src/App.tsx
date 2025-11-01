import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useTelegram } from './hooks/useTelegram';
import { HomePage } from './pages/HomePage';
import { QuestsListPage } from './pages/QuestsListPage';
import { QuestDetailPage } from './pages/QuestDetailPage';
import { LeaderboardPage } from './pages/LeaderboardPage';

function AppContent() {
  const { theme } = useTheme();
  const { webApp } = useTelegram();

  useEffect(() => {
    webApp.ready();
    webApp.expand();
    
    // Проверяем поддержку методов перед использованием
    try {
      // setHeaderColor доступен с версии 6.1
      if (webApp.version >= '6.1' && typeof webApp.setHeaderColor === 'function') {
        webApp.setHeaderColor(theme.colors.background.startsWith('#') 
          ? theme.colors.background as `#${string}` 
          : 'bg_color'
        );
      }
      
      // setBackgroundColor доступен с версии 6.1  
      if (webApp.version >= '6.1' && typeof webApp.setBackgroundColor === 'function') {
        webApp.setBackgroundColor(theme.colors.background.startsWith('#')
          ? theme.colors.background as `#${string}`
          : 'bg_color'
        );
      }
    } catch (e) {
      console.log('Some WebApp methods not supported in this version');
    }

    // Установка viewport для мобильных устройств
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
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
          <Route path="/quests" element={<QuestsListPage />} />
          <Route path="/quest/:questId" element={<QuestDetailPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
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