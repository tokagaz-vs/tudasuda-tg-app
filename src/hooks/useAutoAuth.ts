import { useEffect } from 'react';
import { useTelegram } from './useTelegram';
import { useAuthStore } from '../store/authStore';
import { AuthService } from '../services/auth.service';

export const useAutoAuth = () => {
  const { user: telegramUser } = useTelegram();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    console.log('🔄 useAutoAuth - Telegram User:', telegramUser);
    console.log('🔄 useAutoAuth - Current User:', user);
    
    // Автоматически синхронизируем профиль при загрузке
    if (telegramUser && !user) {
      console.log('✅ Начинаем синхронизацию профиля...');
      syncProfile();
    }
  }, [telegramUser, user]);

  const syncProfile = async () => {
    if (!telegramUser) {
      console.log('❌ Нет данных Telegram пользователя');
      return;
    }

    console.log('📤 Отправляем запрос на синхронизацию:', {
      id: telegramUser.id,
      username: telegramUser.username,
      first_name: telegramUser.first_name,
      photo_url: telegramUser.photo_url,
    });

    const { data, error } = await AuthService.syncWithTelegram(telegramUser);
    
    if (data) {
      console.log('✅ Профиль синхронизирован:', data);
      setUser(data);
    } else {
      console.error('❌ Ошибка синхронизации профиля:', error);
      
      // Даже если ошибка, создаем локальный профиль
      const localProfile = {
        id: telegramUser.id.toString(),
        username: telegramUser.username || `user${telegramUser.id}`,
        full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
        avatar_url: telegramUser.photo_url,
        points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('⚠️ Создаем локальный профиль:', localProfile);
      setUser(localProfile);
    }
  };

  return { user, syncProfile };
};