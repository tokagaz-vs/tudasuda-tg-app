import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useTelegram } from './hooks/useTelegram';
import { useAutoAuth } from './hooks/useAutoAuth'; // Добавь импорт
import { HomePage } from './pages/HomePage';
import { QuestsListPage } from './pages/QuestsListPage';
import { QuestDetailPage } from './pages/QuestDetailPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { DevAuth } from './components/DevAuth';

function AppContent() {
  const { theme } = useTheme();
  const { webApp } = useTelegram();
  const { user } = useAutoAuth(); // Добавь эту строку

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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      
      {/* Тестовая авторизация для разработки */}
      <DevAuth />
      
      {/* Показываем текущего пользователя в dev режиме */}
      {import.meta.env.DEV && user && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          padding: '8px 12px',
          backgroundColor: theme.colors.surface,
          borderRadius: '8px',
          fontSize: '11px',
          color: theme.colors.textSecondary,
          zIndex: 9997,
        }}>
          👤 {user.username} (ID: {user.id})
        </div>
      )}
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