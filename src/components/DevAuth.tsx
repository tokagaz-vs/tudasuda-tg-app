import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { AuthService } from '../services/auth.service';
import { useTheme } from '../contexts/ThemeContext';
import WebApp from '@twa-dev/sdk'; // Добавь этот импорт
import type { TelegramUser } from '../types';

export const DevAuth = () => {
  const { theme } = useTheme();
  const { setUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  // Тестовые пользователи
  const testUsers: TelegramUser[] = [
    {
      id: 123456789,
      first_name: 'Тест',
      last_name: 'Юзер',
      username: 'test_user',
      language_code: 'ru',
      photo_url: 'https://ui-avatars.com/api/?name=Test+User&background=FF6A00&color=fff',
    },
    {
      id: 987654321,
      first_name: 'Джон',
      last_name: 'Доу',
      username: 'john_doe',
      language_code: 'en',
      photo_url: 'https://ui-avatars.com/api/?name=John+Doe&background=7C4DFF&color=fff',
    },
    {
      id: 555555555,
      first_name: 'Исследователь',
      last_name: '',
      username: 'explorer',
      language_code: 'ru',
      photo_url: 'https://ui-avatars.com/api/?name=Explorer&background=22C55E&color=fff',
    },
  ];

  const loginAsTestUser = async (testUser: TelegramUser) => {
    const { data } = await AuthService.syncWithTelegram(testUser);
    if (data) {
      setUser(data);
      setIsOpen(false);
      
      // Имитируем Telegram WebApp данные
      (window as any).Telegram = {
        WebApp: {
          ...WebApp,
          initDataUnsafe: {
            user: testUser,
          },
        },
      };
    }
  };

  // В самом начале компонента, замени проверку:
// Показываем всегда
// if (!import.meta.env.DEV) return null;

if (!isOpen) {
  return (
    <button
      onClick={() => setIsOpen(true)}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '30px',
        backgroundColor: theme.colors.primary,
        border: 'none',
        color: '#FFFFFF',
        fontSize: '28px',
        cursor: 'pointer',
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
      title="Тестовая авторизация"
    >
      🧪
    </button>
  );
}

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '60px',
        right: '10px',
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px',
        padding: '16px',
        width: '280px',
        zIndex: 9998,
        boxShadow: theme.shadows.lg.boxShadow,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: theme.colors.text }}>
          Тестовые пользователи
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: theme.colors.textSecondary,
            cursor: 'pointer',
            padding: 0,
            fontSize: '18px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {testUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => loginAsTestUser(user)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: theme.colors.background,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.surfaceAlt;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.background;
            }}
          >
            <img
              src={user.photo_url}
              alt={user.first_name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
              }}
            />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
                {user.first_name} {user.last_name}
              </div>
              <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                @{user.username} • ID: {user.id}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: `1px solid ${theme.colors.border}`,
          fontSize: '11px',
          color: theme.colors.textLight,
          textAlign: 'center',
        }}
      >
        Только для разработки
      </div>
    </div>
  );
};