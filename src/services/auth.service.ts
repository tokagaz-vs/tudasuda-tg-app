import { supabase } from './supabase';
import type { Profile, TelegramUser } from '../types';

export class AuthService {
  // Получить или создать профиль на основе Telegram данных
  static async syncWithTelegram(telegramUser: TelegramUser): Promise<{ data: Profile | null; error: any }> {
    try {
      const userId = telegramUser.id.toString();
      
      // Пробуем получить существующий профиль
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        // Обновляем данные из Telegram (на случай если изменились)
        const { data: updated, error: updateError } = await supabase
          .from('profiles')
          .update({
            username: telegramUser.username || existingProfile.username,
            full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
            avatar_url: telegramUser.photo_url || existingProfile.avatar_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
          .select()
          .single();

        return { data: updated, error: updateError };
      }

      // Создаем новый профиль
      const newProfile = {
        id: userId,
        username: telegramUser.username || `user${userId}`,
        full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
        avatar_url: telegramUser.photo_url,
        points: 0,
        is_premium: false,
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Sync error:', error);
      return { data: null, error };
    }
  }
}