import { supabase } from './supabase';
import type { Quest, QuestWithDetails, QuestPoint, QuestFilters, QuestCategory, UserProgress } from '../types';

export class QuestService {
  // Получить категории
  static async getCategories() {
    const { data, error } = await supabase
      .from('quest_categories')
      .select('*')
      .order('name', { ascending: true });

    return { data: data as QuestCategory[] | null, error };
  }

  // Получить все квесты с фильтрами
  static async getQuests(filters?: QuestFilters) {
    let query = supabase
      .from('quests')
      .select(`
        *,
        category:quest_categories(*)
      `)
      .eq('status', filters?.status || 'active')
      .order('created_at', { ascending: false });

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }

    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    const { data, error } = await query;
    return { data: data as Quest[] | null, error };
  }

  // Получить популярные квесты
  static async getPopularQuests(limit = 5) {
    const { data, error } = await supabase
      .from('quests')
      .select(`
        *,
        category:quest_categories(*)
      `)
      .eq('status', 'active')
      .order('points_reward', { ascending: false })
      .limit(limit);

    return { data: data as Quest[] | null, error };
  }

  // Получить квест по ID с точками
  static async getQuestById(questId: string) {
    const { data: quest, error: questError } = await supabase
      .from('quests')
      .select(`
        *,
        category:quest_categories(*)
      `)
      .eq('id', questId)
      .single();

    if (questError || !quest) {
      return { data: null, error: questError };
    }

    const { data: points, error: pointsError } = await supabase
      .from('quest_points')
      .select('*')
      .eq('quest_id', questId)
      .order('order_number', { ascending: true });

    if (pointsError) {
      return { data: null, error: pointsError };
    }

    const questWithDetails: QuestWithDetails = {
      ...quest,
      points: points as QuestPoint[],
      totalPoints: points?.reduce((sum, p) => sum + p.points, 0) || 0,
      pointsCount: points?.length || 0,
    };

    return { data: questWithDetails, error: null };
  }

  // Получить квесты пользователя
  static async getUserQuests(userId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        quest:quests(*)
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    return { data, error };
  }

  // Получить прогресс пользователя
  static async getUserProgress(userId: string, questId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('quest_id', questId)
      .single();

    return { data: data as UserProgress | null, error };
  }

  // Начать квест
  static async startQuest(userId: string, questId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .insert([
        {
          user_id: userId,
          quest_id: questId,
          current_point: 0,
          status: 'in_progress',
          total_points: 0,
        },
      ])
      .select()
      .single();

    return { data, error };
  }

  // Обновить прогресс
  static async updateProgress(
    progressId: string,
    currentPoint: number,
    totalPoints: number,
    status?: string
  ) {
    const updates: any = {
      current_point: currentPoint,
      total_points: totalPoints,
    };

    if (status) {
      updates.status = status;
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('id', progressId)
      .select()
      .single();

    return { data, error };
  }

  // Отправить ответ
  static async submitAnswer(
    userId: string,
    questPointId: string,
    progressId: string,
    answer: any,
    photoUrl?: string
  ) {
    // Получить точку квеста
    const { data: point } = await supabase
      .from('quest_points')
      .select('*')
      .eq('id', questPointId)
      .single();

    if (!point) {
      return { data: null, error: 'Point not found' };
    }

    // Проверить ответ
    const isCorrect = this.checkAnswer(point, answer);
    const pointsEarned = isCorrect ? point.points : 0;

    // Сохранить ответ
    const { data, error } = await supabase
      .from('user_answers')
      .insert([
        {
          user_id: userId,
          quest_point_id: questPointId,
          progress_id: progressId,
          answer: typeof answer === 'string' ? answer : JSON.stringify(answer),
          photo_url: photoUrl,
          is_correct: isCorrect,
          points_earned: pointsEarned,
        },
      ])
      .select()
      .single();

    return { 
      data: {
        ...data,
        isCorrect,
        pointsEarned,
      }, 
      error 
    };
  }

  // Проверить ответ
  private static checkAnswer(point: QuestPoint, answer: any): boolean {
    if (!point.correct_answer) return true;

    if (point.task_type === 'multiple_choice') {
      return answer === point.correct_answer;
    }

    if (point.task_type === 'text_input') {
      const correctAnswer = point.correct_answer.toLowerCase().trim();
      const userAnswer = String(answer).toLowerCase().trim();
      return correctAnswer === userAnswer;
    }

    // Для photo и selfie всегда true если фото загружено
    if (point.task_type === 'photo' || point.task_type === 'selfie') {
      return true;
    }

    return false;
  }
}

export const questService = QuestService;