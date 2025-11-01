import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import type { Profile } from '../types';
import { Trophy, Star } from 'lucide-react';

interface LeaderboardUser extends Profile {
  rank: number;
}

export const LeaderboardPage = () => {
  const { theme } = useTheme();
  const { user } = useAuthStore();

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('points', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data) {
        const rankedData: LeaderboardUser[] = data.map((profile, index) => ({
          ...profile,
          rank: index + 1,
        }));

        setLeaderboard(rankedData);

        if (user) {
          const userIndex = rankedData.findIndex((p) => p.id === user.id);
          setUserRank(userIndex !== -1 ? userIndex + 1 : null);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return theme.colors.border;
    }
  };

  const TopThreePodium = () => {
    const top3 = leaderboard.slice(0, 3);
    if (top3.length === 0) return null;

    const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
    const heights = [120, 160, 100];

    return (
      <div
        style={{
          backgroundColor: theme.colors.surface,
          padding: '32px 20px 20px',
          marginBottom: '20px',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          Топ игроков 🏆
        </h2>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '12px',
          }}
        >
          {podiumOrder.map((player, index) => {
            if (!player) return null;

            const actualRank = player.rank;
            const height = heights[index];

            return (
              <div
                key={player.id}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Аватар */}
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '35px',
                    border: `3px solid ${getRankColor(actualRank)}`,
                    marginBottom: '8px',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: theme.colors.borderLight,
                  }}
                >
                  {player.avatar_url ? (
                    <img
                      src={player.avatar_url}
                      alt={player.username}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        color: theme.colors.textLight,
                      }}
                    >
                      👤
                    </div>
                  )}
                  {/* Бейдж ранга */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-5px',
                      right: '-5px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '15px',
                      backgroundColor: getRankColor(actualRank),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${theme.colors.surface}`,
                      fontSize: '16px',
                    }}
                  >
                    {getRankIcon(actualRank)}
                  </div>
                </div>

                {/* Имя */}
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: theme.colors.text,
                    marginBottom: '4px',
                    textAlign: 'center',
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {player.full_name || player.username}
                </div>

                {/* Очки */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <Star size={14} color={theme.colors.warning} fill={theme.colors.warning} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: theme.colors.textSecondary }}>
                    {player.points}
                  </span>
                </div>

                {/* Постамент */}
                <div
                  style={{
                    width: '100%',
                    height: `${height}px`,
                    background: `linear-gradient(135deg, ${getRankColor(actualRank)}, ${getRankColor(actualRank)}80)`,
                    borderTopLeftRadius: theme.borderRadius.md + 'px',
                    borderTopRightRadius: theme.borderRadius.md + 'px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: '8px',
                  }}
                >
                  <span style={{ fontSize: '32px', fontWeight: '700', color: theme.colors.surface }}>
                    {actualRank}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
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

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Топ-3 */}
      <TopThreePodium />

      {/* Карточка позиции пользователя */}
      {user && userRank && (
        <div style={{ padding: '0 20px 20px' }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
              borderRadius: theme.borderRadius.lg + 'px',
              padding: '16px 20px',
              boxShadow: theme.shadows.md.boxShadow,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginBottom: '4px' }}>
                  Ваша позиция
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#FFFFFF' }}>
                  #{userRank}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={20} color="#FFFFFF" fill="#FFFFFF" />
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF' }}>
                  {user.points} очков
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Остальные */}
      {leaderboard.length > 3 && (
        <div style={{ padding: '0 20px' }}>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: theme.colors.textSecondary,
              marginBottom: '12px',
            }}
          >
            Остальные игроки
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leaderboard.slice(3).map((player) => {
              const isCurrentUser = user?.id === player.id;

              return (
                <div
                  key={player.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isCurrentUser
                      ? theme.colors.primary + '15'
                      : theme.colors.surface,
                    padding: '12px 16px',
                    borderRadius: theme.borderRadius.lg + 'px',
                    border: isCurrentUser ? `2px solid ${theme.colors.primary}` : 'none',
                    boxShadow: theme.shadows.sm.boxShadow,
                  }}
                >
                  {/* Ранг */}
                  <div style={{ width: '40px', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: theme.colors.textSecondary,
                      }}
                    >
                      #{player.rank}
                    </span>
                  </div>

                  {/* Аватар */}
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '25px',
                      marginRight: '12px',
                      overflow: 'hidden',
                      backgroundColor: theme.colors.borderLight,
                    }}
                  >
                    {player.avatar_url ? (
                      <img
                        src={player.avatar_url}
                        alt={player.username}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          color: theme.colors.textLight,
                        }}
                      >
                        👤
                      </div>
                    )}
                  </div>

                  {/* Инфо */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: isCurrentUser ? theme.colors.primary : theme.colors.text,
                        marginBottom: '2px',
                      }}
                    >
                      {player.full_name || player.username}
                      {isCurrentUser && ' (Вы)'}
                    </div>
                    <div style={{ fontSize: '13px', color: theme.colors.textSecondary }}>
                      @{player.username}
                    </div>
                  </div>

                  {/* Очки */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={16} color={theme.colors.warning} fill={theme.colors.warning} />
                    <span style={{ fontSize: '16px', fontWeight: '700', color: theme.colors.text }}>
                      {player.points}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Пустое состояние */}
      {leaderboard.length === 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '80px 20px',
          }}
        >
          <Trophy size={64} color={theme.colors.textLight} />
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme.colors.textSecondary,
              marginTop: '16px',
              marginBottom: '4px',
            }}
          >
            Пока нет участников
          </h3>
          <p style={{ fontSize: '14px', color: theme.colors.textLight, textAlign: 'center' }}>
            Начните проходить квесты и станьте первым в рейтинге!
          </p>
        </div>
      )}
    </div>
  );
};