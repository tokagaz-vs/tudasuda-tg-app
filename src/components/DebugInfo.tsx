import { useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { useTheme } from '../contexts/ThemeContext';

export const DebugInfo = () => {
  const [show, setShow] = useState(false);
  const { theme } = useTheme();

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          width: '40px',
          height: '40px',
          borderRadius: '20px',
          backgroundColor: theme.colors.primary,
          border: 'none',
          color: '#FFFFFF',
          fontSize: '12px',
          cursor: 'pointer',
          zIndex: 9999,
        }}
      >
        ℹ️
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px',
        padding: '12px',
        fontSize: '11px',
        color: theme.colors.text,
        maxWidth: '250px',
        zIndex: 9999,
        boxShadow: theme.shadows.lg.boxShadow,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <strong>Debug Info</strong>
        <button
          onClick={() => setShow(false)}
          style={{
            background: 'none',
            border: 'none',
            color: theme.colors.textSecondary,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div>Version: {WebApp.version || 'unknown'}</div>
        <div>Platform: {WebApp.platform || 'unknown'}</div>
        <div>Theme: {WebApp.colorScheme || 'unknown'}</div>
        <div>
          User: {WebApp.initDataUnsafe.user?.id || 'not authenticated'}
        </div>
        <div>
          Header Color: {typeof WebApp.setHeaderColor === 'function' ? '✅' : '❌'}
        </div>
        <div>
          BG Color: {typeof WebApp.setBackgroundColor === 'function' ? '✅' : '❌'}
        </div>
      </div>
    </div>
  );
};