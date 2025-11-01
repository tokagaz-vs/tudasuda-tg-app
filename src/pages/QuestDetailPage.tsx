import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuthStore } from '../store/authStore';
import { useTelegram } from '../hooks/useTelegram';
import { questService } from '../services/quest.service';
import { AuthService } from '../services/auth.service';
import { telegram } from '../utils/telegram';
import { Button, Card, GlassPanel } from '../components/ui';
import type { QuestWithDetails, UserProgress } from '../types';
import {
  Star,
  Clock,
  Zap,
  CheckCircle,
  Play,
  Target,
  Sparkles,
} from 'lucide-react';

const HEADER_HEIGHT = 120;

export const QuestDetailPage = () => {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user: telegramUser } = useTelegram();
  const { user, setUser } = useAuthStore();

  const [quest, setQuest] = useState<QuestWithDetails | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (questId) {
      loadQuest();
    }
  }, [questId]);

  useEffect(() => {
    telegram.showBackButton(() => navigate(-1));
    return () => telegram.hideBackButton();
  }, [navigate]);

  const loadQuest = async () => {
    if (!questId) return;

    const { data } = await questService.getQuestById(questId);
    if (data) {
      setQuest(data);

      if (user) {
        const { data: progressData } = await questService.getUserProgress(user.id, questId);
        if (progressData) setProgress(progressData);
      }
    }
    setIsLoading(false);
  };

  const handleStartQuest = async () => {
    if (!quest) return;

    // Если нет user, пробуем синхронизировать с Telegram
    let currentUser = user;
    if (!currentUser && telegramUser) {
      const { data } = await AuthService.syncWithTelegram(telegramUser);
      if (data) {
        setUser(data);
        currentUser = data;
      }
    }

    // Если все еще нет user, используем данные из Telegram
    if (!currentUser && telegramUser) {
      currentUser = {
        id: telegramUser.id.toString(),
        username: telegramUser.username || `user${telegramUser.id}`,
        full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
        avatar_url: telegramUser.photo_url,
        points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(currentUser);
    }

    if (!currentUser) {
      telegram.showAlert('Откройте приложение через Telegram');
      return;
    }

    setIsStarting(true);

    if (progress && progress.status === 'in_progress') {
      navigate(`/quest/${quest.id}/play`);
      setIsStarting(false);
      return;
    }

    const { error } = await questService.startQuest(currentUser.id, quest.id);

    if (error) {
      telegram.showAlert('Не удалось начать квест');
      setIsStarting(false);
      return;
    }

    telegram.notificationOccurred('success');
    setIsStarting(false);
    navigate(`/quest/${quest.id}/play`);
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '30м';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}ч ${mins > 0 ? mins + 'м' : ''}`;
    return `${mins}м`;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      easy: 'Легко',
      medium: 'Средне',
      hard: 'Сложно',
    };
    return labels[difficulty] || difficulty;
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: theme.colors.background,
        }}
      >
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  if (!quest) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: theme.colors.background,
          gap: '16px',
          padding: '20px',
        }}
      >
        <Target size={64} color={theme.colors.textLight} />
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.textSecondary }}>
          Квест не найден
        </h2>
        <Button title="Назад" onPress={() => navigate(-1)} variant="outline" />
      </div>
    );
  }

  const isInProgress = progress?.status === 'in_progress';
  const isCompleted = progress?.status === 'completed';

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh', paddingBottom: '120px' }}>
      {/* Градиентный хедер */}
      <div
        style={{
          position: 'relative',
          height: `${HEADER_HEIGHT}px`,
          background: `linear-gradient(135deg, ${quest.category?.color || theme.colors.primary}, ${theme.colors.background})`,
          overflow: 'hidden',
        }}
      >
        {/* Декоративные элементы */}
        <Sparkles
          size={16}
          color="rgba(255,255,255,0.2)"
          style={{ position: 'absolute', top: '40px', right: '30px' }}
        />
        <Sparkles
          size={12}
          color="rgba(255,255,255,0.15)"
          style={{ position: 'absolute', top: '60px', left: '40px' }}
        />
        <Sparkles
          size={14}
          color="rgba(255,255,255,0.1)"
          style={{ position: 'absolute', top: '80px', right: '80px' }}
        />
      </div>

      {/* Контент */}
      <div style={{ padding: '20px', marginTop: '-40px' }}>
        {/* Основная карточка */}
        <div style={{ animation: 'fadeIn 0.3s ease-out 0.2s both' }}>
          <Card variant="glass">
            {/* Категория и статус */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {quest.category && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: quest.category.color || theme.colors.primary,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: theme.colors.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {quest.category.name}
                  </span>
                </div>
              )}

              {isCompleted && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '999px',
                    backgroundColor: theme.colors.success,
                  }}
                >
                  <CheckCircle size={14} color="#FFFFFF" />
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#FFFFFF' }}>
                    Пройден
                  </span>
                </div>
              )}

              {isInProgress && progress && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '999px',
                    backgroundColor: theme.colors.info,
                  }}
                >
                  <Play size={14} color="#FFFFFF" />
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#FFFFFF' }}>
                    {Math.round((progress.current_point / quest.pointsCount) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Заголовок */}
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: theme.colors.text,
                margin: '0 0 8px 0',
                letterSpacing: '-0.5px',
                lineHeight: '30px',
              }}
            >
              {quest.title}
            </h1>

            {/* Описание */}
            {quest.description && (
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: theme.colors.textSecondary,
                  margin: 0,
                }}
              >
                {quest.description}
              </p>
            )}
          </Card>
        </div>

        {/* Статистика */}
        <div style={{ animation: 'fadeIn 0.3s ease-out 0.3s both', marginTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 4px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                }}
              >
                <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: theme.colors.text }}>
                {quest.totalPoints || 0}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: theme.colors.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}
              >
                Очков
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 4px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${theme.colors.secondary}, #18A0FB)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                }}
              >
                <Clock size={16} color="#FFFFFF" />
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: theme.colors.text }}>
                {formatDuration(quest.estimated_duration)}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: theme.colors.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}
              >
                Время
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 4px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${theme.colors.warning}, #DC2626)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                }}
              >
                <Zap size={16} color="#FFFFFF" fill="#FFFFFF" />
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: theme.colors.text }}>
                {getDifficultyLabel(quest.difficulty)}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: theme.colors.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}
              >
                Уровень
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 4px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${theme.colors.success}, #10B981)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                }}
              >
                <Target size={16} color="#FFFFFF" />
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: theme.colors.text }}>
                {quest.pointsCount || quest.points?.length || 0}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: theme.colors.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}
              >
                Точек
              </div>
            </div>
          </div>
        </div>

        {/* Прогресс */}
        {progress && !isCompleted && (
          <div style={{ animation: 'fadeIn 0.3s ease-out 0.4s both', marginTop: '16px' }}>
            <Card variant="glass">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
                  Прогресс
                </span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: theme.colors.primary }}>
                  {Math.round((progress.current_point / quest.pointsCount) * 100)}%
                </span>
              </div>
              <div
                style={{
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: theme.colors.border,
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(progress.current_point / quest.pointsCount) * 100}%`,
                    background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                  {progress.current_point}/{quest.pointsCount} точек
                </span>
                <span style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                  {progress.total_points} очков
                </span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Кнопка действия */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 20px 16px',
          backgroundColor: theme.colors.background,
        }}
      >
        <GlassPanel padding={0}>
          <div style={{ padding: '0' }}>
            {isCompleted ? (
              <Button
                title="Пройти снова"
                variant="secondary"
                size="large"
                onPress={handleStartQuest}
                loading={isStarting}
                fullWidth
                icon={<Play size={24} color="#FFFFFF" />}
              />
            ) : isInProgress ? (
              <Button
                title="Продолжить"
                variant="primary"
                size="large"
                onPress={handleStartQuest}
                fullWidth
                icon={<Play size={24} color="#FFFFFF" />}
              />
            ) : (
              <Button
                title="Начать квест"
                variant="primary"
                size="large"
                onPress={handleStartQuest}
                loading={isStarting}
                fullWidth
                icon={<Star size={24} color="#FFFFFF" />}
              />
            )}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};