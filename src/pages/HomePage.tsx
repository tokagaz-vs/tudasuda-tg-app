import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useTelegram } from '../hooks/useTelegram';
import { useAuthStore } from '../store/authStore';
import { questService } from '../services/quest.service';
import { AuthService } from '../services/auth.service';
import { Button, Card, GlassPanel } from '../components/ui';
import { telegram } from '../utils/telegram';
import type { Quest } from '../types';
import {
  Home,
  MapPin,
  Trophy,
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  User,
} from 'lucide-react';

export const HomePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user: telegramUser } = useTelegram();
  const { user, setUser } = useAuthStore();
  const [popularQuests, setPopularQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Аутентификация при загрузке
  useEffect(() => {
    if (telegramUser && !user) {
      authenticateUser();
    }
  }, [telegramUser]);

  // Загрузка квестов
  useEffect(() => {
    loadPopularQuests();
  }, []);

  const authenticateUser = async () => {
  if (!telegramUser) return;

  const { data, error } = await AuthService.syncWithTelegram(telegramUser);
  
  if (data) {
    setUser(data);
  } else {
    console.error('Failed to sync profile:', error);
  }
};

  const loadPopularQuests = async () => {
    setIsLoading(true);
    const { data } = await questService.getPopularQuests(5);
    if (data) setPopularQuests(data);
    setIsLoading(false);
  };

  const QuickActionButton = ({
    icon: Icon,
    label,
    color,
    onPress,
  }: {
    icon: any;
    label: string;
    color: string;
    onPress: () => void;
  }) => (
    <div
      onClick={onPress}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        flex: 1,
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: theme.borderRadius.lg + 'px',
          background: `linear-gradient(135deg, ${color}, ${color}99)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: theme.shadows.md.boxShadow,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <Icon size={24} color="#FFFFFF" strokeWidth={2.5} />
      </div>
      <span
        style={{
          fontSize: '12px',
          fontWeight: '600',
          color: theme.colors.text,
        }}
      >
        {label}
      </span>
    </div>
  );

  const QuestCard = ({ quest, index }: { quest: Quest; index: number }) => (
    <div
      style={{
        animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`,
      }}
    >
      <Card
        variant="glass"
        onClick={() => {
          telegram.impactOccurred('light');
          navigate(`/quest/${quest.id}`);
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: quest.category?.color || theme.colors.primary,
              }}
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: theme.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {quest.category?.name || 'Квест'}
            </span>
          </div>
          <ArrowRight size={20} color={theme.colors.textLight} />
        </div>

        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: '6px',
            letterSpacing: '-0.2px',
          }}
        >
          {quest.title}
        </h3>

        {quest.description && (
          <p
            style={{
              fontSize: '14px',
              color: theme.colors.textSecondary,
              lineHeight: '20px',
              marginBottom: '12px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {quest.description}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={16} color={theme.colors.warning} fill={theme.colors.warning} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: theme.colors.text }}>
              {quest.points_reward || 0}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={16} color={theme.colors.primary} fill={theme.colors.primary} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: theme.colors.text }}>
              {getDifficultyLabel(quest.difficulty)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        minHeight: '100vh',
        paddingBottom: '100px',
      }}
    >
      {/* Градиентный хедер */}
      <div
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
          padding: '32px 20px',
          borderBottomLeftRadius: theme.borderRadius.xxl + 'px',
          borderBottomRightRadius: theme.borderRadius.xxl + 'px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Декоративные элементы */}
        <Sparkles
          size={16}
          color="rgba(255,255,255,0.3)"
          style={{ position: 'absolute', top: '20px', right: '40px' }}
        />
        <Sparkles
          size={12}
          color="rgba(255,255,255,0.2)"
          style={{ position: 'absolute', top: '60px', right: '20px' }}
        />
        <Sparkles
          size={20}
          color="rgba(255,255,255,0.15)"
          style={{ position: 'absolute', bottom: '40px', left: '30px' }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px',
            }}
          >
            <div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
                {getGreeting()}
              </p>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#FFFFFF' }}>
                {user?.full_name || telegramUser?.first_name || 'Путешественник'}
              </h1>
            </div>

            <GlassPanel padding={10} borderRadius={999} blur={10}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 6px' }}>
                <Star size={20} color="#FFD700" fill="#FFD700" />
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>
                  {user?.points || 0}
                </span>
              </div>
            </GlassPanel>
          </div>

          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)' }}>
            Исследуй город и получай награды
          </p>
        </div>
      </div>

      {/* Быстрые действия */}
      <div
        style={{
          display: 'flex',
          padding: '24px 20px 8px',
          gap: '12px',
        }}
      >
        <QuickActionButton
         icon={User}
         label="Профиль"
         color={theme.colors.secondary}
         onPress={() => navigate('/profile')}
        />
        <QuickActionButton
          icon={Target}
          label="Квесты"
          color={theme.colors.primary}
          onPress={() => navigate('/quests')}
        />
        <QuickActionButton
          icon={MapPin}
          label="Карта"
          color={theme.colors.success}
          onPress={() => navigate('/map')}
        />
        <QuickActionButton
          icon={Trophy}
          label="Рейтинг"
          color={theme.colors.warning}
          onPress={() => navigate('/leaderboard')}
        />
        <QuickActionButton
          icon={Home}
          label="События"
          color={theme.colors.secondary}
          onPress={() => navigate('/news')}
        />
      </div>

      {/* Популярные квесты */}
      <div style={{ padding: '16px 20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: theme.colors.text }}>
              Популярные квесты
            </h2>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginTop: '2px' }}>
              Выбор сообщества
            </p>
          </div>
          <Button
            title="Все"
            variant="ghost"
            size="small"
            icon={<ArrowRight size={16} color={theme.colors.primary} />}
            iconPosition="right"
            onPress={() => navigate('/quests')}
          />
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : popularQuests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {popularQuests.map((quest, index) => (
              <QuestCard key={quest.id} quest={quest} index={index} />
            ))}
          </div>
        ) : (
          <Card variant="glass">
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Target size={48} color={theme.colors.textLight} />
              <p style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.textSecondary, marginTop: '16px' }}>
                Квесты скоро появятся
              </p>
              <p style={{ fontSize: '14px', color: theme.colors.textLight, marginTop: '4px' }}>
                Мы готовим для вас увлекательные приключения
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Временная кнопка для проверки */}
<div style={{
  position: 'fixed',
  top: '10px',
  right: '10px',
  zIndex: 10000,
}}>
  <button
    onClick={() => {
      console.log('=== DEBUG INFO ===');
      console.log('Telegram User:', telegramUser);
      console.log('App User:', user);
      telegram.showAlert(
        `Telegram ID: ${telegramUser?.id || 'Нет'}\n` +
        `Username: ${telegramUser?.username || 'Нет'}\n` +
        `App User ID: ${user?.id || 'Нет'}\n` +
        `Avatar: ${user?.avatar_url || 'Нет'}`
      );
    }}
    style={{
      padding: '10px 15px',
      backgroundColor: theme.colors.primary,
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    }}
  >
    🐛 Debug
  </button>
</div>

      {/* Промо-баннер */}
      <div style={{ padding: '0 20px 24px' }}>
        <Card variant="gradient" gradient={[theme.colors.secondary, '#18A0FB'] as const}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Zap size={32} color="#FFFFFF" fill="#FFFFFF" />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                Начни приключение
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                Пройди первый квест и получи 100 очков
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return 'Доброй ночи 🌙';
  if (hour < 12) return 'Доброе утро ☀️';
  if (hour < 18) return 'Добрый день 👋';
  return 'Добрый вечер 🌆';
};

const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно',
  };
  return labels[difficulty] || difficulty;
};