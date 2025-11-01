import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useTelegram } from '../hooks/useTelegram';
import { useAuthStore } from '../store/authStore';
import { questService } from '../services/quest.service';
import { AuthService } from '../services/auth.service';
import { telegram } from '../utils/telegram';
import { Card, Button, GlassPanel } from '../components/ui';
import {
  Star,
  Trophy,
  Rocket,
  TrendingUp,
  Bell,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  Camera,
  X,
  Check,
  Zap,
  Crown,
} from 'lucide-react';

export const ProfilePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user: telegramUser } = useTelegram();
  const { user, setUser } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Статистика
  const [stats, setStats] = useState({
    completedQuests: 0,
    inProgressQuests: 0,
    totalPoints: 0,
    achievements: 0,
    rank: 0,
  });

  // Форма редактирования
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    full_name: user?.full_name || '',
    avatar_url: user?.avatar_url || '',
  });

  useEffect(() => {
    if (telegramUser && !user) {
      authenticateUser();
    }
  }, [telegramUser]);

  useEffect(() => {
    if (user) {
      loadUserStats();
      setEditForm({
        username: user.username || '',
        full_name: user.full_name || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user]);

  useEffect(() => {
    telegram.showBackButton(() => navigate(-1));
    return () => telegram.hideBackButton();
  }, [navigate]);

  const authenticateUser = async () => {
    if (!telegramUser) return;

    const { data } = await AuthService.authenticateWithTelegram(telegramUser);
    if (data) {
      setUser(data);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const { data: quests } = await questService.getUserQuests(user.id);

      let completed = 0;
      let inProgress = 0;

      if (quests && Array.isArray(quests)) {
        completed = quests.filter((q: any) => q.status === 'completed').length;
        inProgress = quests.filter((q: any) => q.status === 'in_progress').length;
      }

      setStats({
        completedQuests: completed,
        inProgressQuests: inProgress,
        totalPoints: user.points || 0,
        achievements: 0, // TODO: загрузить достижения
        rank: 1, // TODO: вычислить ранг
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSignOut = () => {
    telegram.showConfirm('Вы уверены, что хотите выйти?').then((confirmed) => {
      if (confirmed) {
        // Очищаем store
        setUser(null);
        navigate('/');
      }
    });
  };

  const StatCard = ({
    icon: Icon,
    value,
    label,
    gradient,
  }: {
    icon: any;
    value: string | number;
    label: string;
    gradient: string;
  }) => (
    <div style={{ flex: 1 }}>
      <Card variant="glass">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '22px',
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <Icon size={20} color="#FFFFFF" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: theme.colors.text }}>
            {value}
          </div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: theme.colors.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {label}
          </div>
        </div>
      </Card>
    </div>
  );

  const MenuItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    danger,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress: () => void;
    danger?: boolean;
  }) => (
    <button
      onClick={() => {
        telegram.impactOccurred('light');
        onPress();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        background: 'none',
        border: 'none',
        borderBottom: `1px solid ${theme.colors.border}`,
        width: '100%',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '22px',
          backgroundColor: danger ? theme.colors.error + '15' : theme.colors.surfaceAlt,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '16px',
        }}
      >
        <Icon size={20} color={danger ? theme.colors.error : theme.colors.text} />
      </div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: danger ? theme.colors.error : theme.colors.text,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: '13px', color: theme.colors.textSecondary, marginTop: '2px' }}>
            {subtitle}
          </div>
        )}
      </div>
    </button>
  );

  if (!telegramUser && !user) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: theme.colors.background,
          padding: '20px',
        }}
      >
        <Shield size={64} color={theme.colors.textLight} />
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.textSecondary, marginTop: '16px' }}>
          Необходима авторизация
        </h2>
        <p style={{ fontSize: '14px', color: theme.colors.textLight, textAlign: 'center' }}>
          Откройте приложение через Telegram
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Градиентный хедер с аватаром */}
      <div
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
          padding: '32px 20px',
          borderBottomLeftRadius: theme.borderRadius.xxl + 'px',
          borderBottomRightRadius: theme.borderRadius.xxl + 'px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Аватар */}
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50px',
              backgroundColor: theme.colors.surface,
              border: `4px solid rgba(255,255,255,0.3)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              marginBottom: '16px',
              position: 'relative',
            }}
          >
            {user?.avatar_url || telegramUser?.photo_url ? (
              <img
                src={user?.avatar_url || telegramUser?.photo_url}
                alt="Avatar"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              '👤'
            )}
            {user?.is_premium && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '32px',
                  height: '32px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Crown size={16} color="#FFD700" />
              </div>
            )}
          </div>

          {/* Имя */}
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
            {user?.full_name || telegramUser?.first_name || 'Путешественник'}
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)' }}>
            @{user?.username || telegramUser?.username || 'user'}
          </p>
        </div>
      </div>

      {/* Статистика */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <StatCard
            icon={Trophy}
            value={stats.completedQuests}
            label="Пройдено"
            gradient={`linear-gradient(135deg, ${theme.colors.warning}, #DC2626)`}
          />
          <StatCard
            icon={Rocket}
            value={stats.inProgressQuests}
            label="В процессе"
            gradient={`linear-gradient(135deg, ${theme.colors.secondary}, #18A0FB)`}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <StatCard
            icon={Star}
            value={stats.totalPoints}
            label="Очков"
            gradient={`linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`}
          />
          <StatCard
            icon={TrendingUp}
            value={`#${stats.rank}`}
            label="Место"
            gradient={`linear-gradient(135deg, ${theme.colors.success}, #10B981)`}
          />
        </div>
      </div>

      {/* Premium баннер (если не премиум) */}
      {!user?.is_premium && (
        <div style={{ padding: '0 20px 20px' }}>
          <Card variant="gradient" gradient={[theme.colors.secondary, '#18A0FB']}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Crown size={32} color="#FFFFFF" />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                  Попробуй Premium
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                  Получи эксклюзивные рамки и бонусы
                </p>
              </div>
              <Zap size={24} color="#FFFFFF" />
            </div>
          </Card>
        </div>
      )}

      {/* Меню */}
      <div style={{ padding: '0 20px' }}>
        <Card variant="glass" padding={0}>
          <MenuItem
            icon={Bell}
            title="Уведомления"
            subtitle="Управление уведомлениями"
            onPress={() => telegram.showAlert('В разработке')}
          />
          <MenuItem
            icon={Shield}
            title="Приватность"
            subtitle="Настройки конфиденциальности"
            onPress={() => telegram.showAlert('В разработке')}
          />
          <MenuItem
            icon={HelpCircle}
            title="Помощь и поддержка"
            subtitle="Свяжитесь с нами"
            onPress={() => telegram.openLink('https://t.me/support')}
          />
          <MenuItem
            icon={Info}
            title="О приложении"
            subtitle="Версия 1.0.0"
            onPress={() =>
              telegram.showAlert('TudaSuda v1.0.0\n\n© 2024 Все права защищены')
            }
          />
          <MenuItem icon={LogOut} title="Выйти" onPress={handleSignOut} danger />
        </Card>
      </div>
    </div>
  );
};