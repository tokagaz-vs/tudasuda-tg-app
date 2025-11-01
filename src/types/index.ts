// ============================================
// БАЗОВЫЕ ТИПЫ
// ============================================

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  points: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// КВЕСТЫ
// ============================================

export type QuestDifficulty = 'easy' | 'medium' | 'hard';
export type QuestStatus = 'active' | 'inactive' | 'draft';

export interface QuestCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  created_at: string;
}

export interface Quest {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  preview_images?: string[];
  difficulty: QuestDifficulty;
  points_reward: number;
  status: QuestStatus;
  category_id?: string;
  category?: QuestCategory;
  tags?: string[];
  tips?: string;
  estimated_duration?: number;
  total_distance?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type TaskType = 'multiple_choice' | 'text_input' | 'photo' | 'selfie';

export interface QuestPoint {
  id: string;
  quest_id: string;
  order_number: number;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  radius: number;
  task_type: TaskType;
  task_data?: any;
  correct_answer?: string;
  points: number;
  audio_url?: string;
  hint?: string;
  excursion_text?: string;
  image_url?: string;
  created_at: string;
}

export interface QuestWithDetails extends Quest {
  points: QuestPoint[];
  totalPoints: number;
  pointsCount: number;
}

// ============================================
// ПРОГРЕСС ПОЛЬЗОВАТЕЛЯ
// ============================================

export type ProgressStatus = 'in_progress' | 'completed' | 'abandoned';

export interface UserProgress {
  id: string;
  user_id: string;
  quest_id: string;
  current_point: number;
  status: ProgressStatus;
  started_at: string;
  completed_at?: string;
  total_points: number;
}

export interface UserAnswer {
  id: string;
  user_id: string;
  quest_point_id: string;
  progress_id: string;
  answer?: string;
  photo_url?: string;
  is_correct: boolean;
  points_earned: number;
  answered_at: string;
}

// ============================================
// ДОСТИЖЕНИЯ
// ============================================

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  condition?: any;
  points: number;
  created_at: string;
}

export interface UserAchievement {
  user_id: string;
  achievement_id: string;
  achievement?: Achievement;
  earned_at: string;
}

// ============================================
// МАГАЗИН
// ============================================

export type ShopItemType = 'physical' | 'virtual';
export type PurchaseStatus = 'pending' | 'completed' | 'cancelled';

export interface ShopItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  points_cost: number;
  stock?: number;
  type: ShopItemType;
  is_available: boolean;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  item_id: string;
  item?: ShopItem;
  points_spent: number;
  status: PurchaseStatus;
  purchased_at: string;
}

// ============================================
// НОВОСТИ
// ============================================

export interface News {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  author_id?: string;
  author?: Profile;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

// ============================================
// ЧАТ И СООБЩЕНИЯ
// ============================================

export type ChatType = 'direct' | 'quest_search' | 'group';
export type MessageType = 'text' | 'voice' | 'video' | 'image' | 'sticker' | 'circle';

export interface Chat {
  id: string;
  name?: string;
  type: ChatType;
  created_at: string;
}

export interface ChatMember {
  chat_id: string;
  user_id: string;
  user?: Profile;
  joined_at: string;
  last_read_at?: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  sender?: Profile;
  content?: string;
  message_type: MessageType;
  media_url?: string;
  duration?: number;
  sticker_pack?: string;
  created_at: string;
}

// ============================================
// ПОИСК КОМПАНЬОНОВ
// ============================================

export type CompanionRequestStatus = 'open' | 'closed' | 'cancelled';
export type ParticipantStatus = 'pending' | 'accepted' | 'declined';

export interface CompanionRequest {
  id: string;
  user_id: string;
  quest_id?: string;
  title: string;
  description?: string;
  max_people: number;
  meeting_time?: string;
  status: CompanionRequestStatus;
  chat_id?: string;
  created_at: string;
  updated_at: string;
  user?: Profile;
  quest?: Quest;
  participants?: CompanionParticipant[];
}

export interface CompanionParticipant {
  id: string;
  request_id: string;
  user_id: string;
  status: ParticipantStatus;
  joined_at: string;
  user?: Profile;
}

// ============================================
// ГЕОЛОКАЦИЯ
// ============================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationDistance {
  distance: number;
  isInRange: boolean;
}

// ============================================
// ФИЛЬТРЫ
// ============================================

export interface QuestFilters {
  category_id?: string;
  difficulty?: QuestDifficulty;
  search?: string;
  status?: QuestStatus;
}

// ============================================
// TELEGRAM WEB APP TYPES
// ============================================

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}