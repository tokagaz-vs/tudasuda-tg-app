import { useEffect } from 'react';
import { useTelegram } from './useTelegram';
import { useAuthStore } from '../store/authStore';
import { AuthService } from '../services/auth.service';

export const useAutoAuth = () => {
  const { user: telegramUser } = useTelegram();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    // Автоматически синхронизируем профиль при загрузке
    if (telegramUser && !user) {
      syncProfile();
    }
  }, [telegramUser]);

  const syncProfile = async () => {
    if (!telegramUser) return;

    const { data, error } = await AuthService.syncWithTelegram(telegramUser);
    
    if (data) {
      setUser(data);
      console.log('Profile synced:', data);
    } else {
      console.error('Failed to sync profile:', error);
      // Даже если ошибка, создаем локальный профиль
      setUser({
        id: telegramUser.id.toString(),
        username: telegramUser.username || `user${telegramUser.id}`,
        full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
        avatar_url: telegramUser.photo_url,
        points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  };

  return { user, syncProfile };
};