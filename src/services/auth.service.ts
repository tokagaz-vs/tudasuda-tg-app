import { supabase } from './supabase';
import type { Profile, TelegramUser } from '../types';

export class AuthService {
  static async syncWithTelegram(telegramUser: TelegramUser): Promise<{ data: Profile | null; error: any }> {
    try {
      const userId = telegramUser.id.toString();
      
      console.log('🔄 Синхронизация профиля для ID:', userId);
      
      // Пробуем получить существующий профиль
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Ошибка получения профиля:', fetchError);
      }

      if (existingProfile) {
        console.log('✅ Профиль найден:', existingProfile);
        
        // Обновляем данные из Telegram
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

        if (updateError) {
          console.error('❌ Ошибка обновления профиля:', updateError);
        }

        return { data: updated || existingProfile, error: null };
      }

      console.log('📝 Создаем новый профиль');

      // Создаем новый профиль БЕЗ is_premium
      const newProfile = {
        id: userId,
        username: telegramUser.username || `user${userId}`,
        full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
        avatar_url: telegramUser.photo_url || null,
        points: 0,
      };

      console.log('📤 Новый профиль:', newProfile);

      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (error) {
        console.error('❌ Ошибка создания профиля:', error);
        console.error('❌ Код ошибки:', error.code);
        console.error('❌ Сообщение:', error.message);
        console.error('❌ Детали:', error.details);
      } else {
        console.log('✅ Профиль создан:', data);
      }

      return { data, error };
    } catch (error) {
      console.error('❌ Критическая ошибка синхронизации:', error);
      return { data: null, error };
    }
  }
}