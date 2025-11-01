import { supabase } from './supabase';
import type { Profile, TelegramUser } from '../types';

export class AuthService {
  // Аутентификация через Telegram
  static async authenticateWithTelegram(telegramUser: TelegramUser, initData: string) {
    try {
      // Проверяем существующего пользователя
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', telegramUser.id.toString())
        .single();

      if (existingProfile) {
        return { data: existingProfile, error: null };
      }

      // Создаем нового пользователя
      const newProfile: Partial<Profile> = {
        id: telegramUser.id.toString(),
        username: telegramUser.username || telegramUser.first_name,
        full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
        avatar_url: telegramUser.photo_url,
        points: 0,
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Auth error:', error);
      return { data: null, error };
    }
  }

  // Получить профиль пользователя
  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  }

  // Обновить профиль
  static async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  }
}