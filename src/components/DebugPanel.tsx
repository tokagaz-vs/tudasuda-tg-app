import { useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../contexts/ThemeContext';

export const DebugPanel = () => {
  const [show, setShow] = useState(false);
  const { theme } = useTheme();
  const { user: telegramUser, webApp } = useTelegram();
  const { user } = useAuthStore();

  if (!import.meta.env.DEV) return null;

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        style={{
          position: 'fixed',
          bottom: '120px',
          right: '10px',
          width: '50px',
          height: '50px',
          borderRadius: '25px',
          backgroundColor: theme.colors.secondary,
          border: 'none',
          color: '#FFFFFF',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 9997,
          boxShadow: theme.shadows.lg.boxShadow,
        }}
        title="Debug Info"
      >
        🐛
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '120px',
        right: '10px',
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px',
        padding: '16px',
        width: '300px',
        maxHeight: '500px',
        overflowY: 'auto',
        zIndex: 9997,
        boxShadow: theme.shadows.lg.boxShadow,
        fontSize: '11px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <strong style={{ color: theme.colors.text }}>Debug Panel</strong>
        <button
          onClick={() => setShow(false)}
          style={{
            background: 'none',
            border: 'none',
            color: theme.colors.textSecondary,
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ color: theme.colors.text }}>
        <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: `1px solid ${theme.colors.border}` }}>
          <strong>Telegram User:</strong>
          {telegramUser ? (
            <pre style={{ margin: '4px 0', fontSize: '10px', overflow: 'auto' }}>
              {JSON.stringify(telegramUser, null, 2)}
            </pre>
          ) : (
            <div style={{ color: theme.colors.error }}>❌ Нет данных</div>
          )}
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: `1px solid ${theme.colors.border}` }}>
          <strong>App User:</strong>
          {user ? (
            <pre style={{ margin: '4px 0', fontSize: '10px', overflow: 'auto' }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          ) : (
            <div style={{ color: theme.colors.error }}>❌ Нет данных</div>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <strong>WebApp Info:</strong>
          <div style={{ marginTop: '4px' }}>
            <div>Platform: {webApp.platform}</div>
            <div>Version: {webApp.version}</div>
            <div>Theme: {webApp.colorScheme}</div>
          </div>
        </div>
      </div>
    </div>
  );
};