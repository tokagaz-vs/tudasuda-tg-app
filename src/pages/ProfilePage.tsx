import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useTelegram } from '../hooks/useTelegram';
import { useAuthStore } from '../store/authStore';
import { questService } from '../services/quest.service';
import { supabase } from '../services/supabase';
import { telegram } from '../utils/telegram';
import { Card, Button } from '../components/ui';
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
    username: '',
    full_name: '',
    avatar_url: '',
  });

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

      // Получаем ранг пользователя
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, points')
        .order('points', { ascending: false });

      const rank = profiles ? profiles.findIndex((p) => p.id === user.id) + 1 : 0;

      setStats({
        completedQuests: completed,
        inProgressQuests: inProgress,
        totalPoints: user.points || 0,
        achievements: 0,
        rank: rank || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .update({
        username: editForm.username.trim() || user.username,
        full_name: editForm.full_name.trim() || user.full_name,
        avatar_url: editForm.avatar_url.trim() || user.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    setIsLoading(false);

    if (data) {
      setUser(data);
      setShowEditModal(false);
      alert('Профиль обновлен!');
    } else {
      console.error('Profile update error:', error);
      alert('Ошибка при обновлении профиля');
    }
  };

  const handleSignOut = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      setUser(null);
      navigate('/');
    }
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
              overflow: 'hidden',
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
          </div>

          {/* Имя */}
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
            {user?.full_name || telegramUser?.first_name || 'Путешественник'}
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>
            @{user?.username || telegramUser?.username || 'user'}
          </p>

          {/* Кнопка редактирования */}
          <button
            onClick={() => {
              setEditForm({
                username: user?.username || '',
                full_name: user?.full_name || '',
                avatar_url: user?.avatar_url || '',
              });
              setShowEditModal(true);
            }}
            style={{
              padding: '8px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '999px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Редактировать профиль
          </button>
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
            value={stats.rank > 0 ? `#${stats.rank}` : '-'}
            label="Место"
            gradient={`linear-gradient(135deg, ${theme.colors.success}, #10B981)`}
          />
        </div>
      </div>

      {/* Меню */}
      <div style={{ padding: '0 20px' }}>
        <Card variant="glass" padding={0}>
          <MenuItem
            icon={Bell}
            title="Уведомления"
            subtitle="Управление уведомлениями"
            onPress={() => alert('В разработке')}
          />
          <MenuItem
            icon={Shield}
            title="Приватность"
            subtitle="Настройки конфиденциальности"
            onPress={() => alert('В разработке')}
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
            onPress={() => alert('TudaSuda v1.0.0\n\n© 2024 Все права защищены')}
          />
          <MenuItem icon={LogOut} title="Выйти" onPress={handleSignOut} danger />
        </Card>
      </div>

      {/* Модалка редактирования */}
      {showEditModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.xl + 'px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: theme.colors.text, marginBottom: '20px' }}>
              Редактировать профиль
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '8px', display: 'block' }}>
                Имя пользователя
              </label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md + 'px',
                  color: theme.colors.text,
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '8px', display: 'block' }}>
                Полное имя
              </label>
              <input
                type="text"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md + 'px',
                  color: theme.colors.text,
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '8px', display: 'block' }}>
                URL фото профиля
              </label>
              <input
                type="text"
                value={editForm.avatar_url}
                onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                placeholder="https://..."
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md + 'px',
                  color: theme.colors.text,
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                title="Отмена"
                variant="outline"
                fullWidth
                onPress={() => setShowEditModal(false)}
              />
              <Button
                title="Сохранить"
                variant="primary"
                fullWidth
                loading={isLoading}
                onPress={handleSaveProfile}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};