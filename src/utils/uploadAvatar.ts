import { supabase } from '../services/supabase';

export const uploadAvatarFromUrl = async (
  userId: string,
  imageUrl: string
): Promise<string | null> => {
  try {
    // Скачиваем изображение
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Загружаем в Supabase Storage
    const fileName = `${userId}-${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // Получаем публичный URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Avatar upload error:', error);
    return null;
  }
};