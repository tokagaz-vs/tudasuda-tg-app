import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { questService } from '../services/quest.service';
import { telegram } from '../utils/telegram';
import { Button, Card } from '../components/ui';
import type { Quest, QuestCategory, QuestFilters, QuestDifficulty } from '../types';
import { DIFFICULTY_LEVELS } from '../constants';
import {
  Search,
  SlidersHorizontal,
  X,
  Target,
  Star,
  Clock,
  Zap,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export const QuestsListPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [quests, setQuests] = useState<Quest[]>([]);
  const [categories, setCategories] = useState<QuestCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState<QuestFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadQuests();
  }, [filters]);

  useEffect(() => {
    telegram.showBackButton(() => navigate(-1));
    return () => telegram.hideBackButton();
  }, [navigate]);

  const loadData = async () => {
    await Promise.all([loadCategories(), loadQuests()]);
    setIsLoading(false);
  };

  const loadCategories = async () => {
    const { data } = await questService.getCategories();
    if (data) setCategories(data);
  };

  const loadQuests = async () => {
    const { data } = await questService.getQuests(filters);
    if (data) setQuests(data);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadQuests();
    setRefreshing(false);
  };

  const handleSearch = () => {
    setFilters({ ...filters, search: searchQuery });
  };

  const toggleCategory = (categoryId: string) => {
    telegram.selectionChanged();
    setFilters({
      ...filters,
      category_id: filters.category_id === categoryId ? undefined : categoryId,
    });
  };

  const toggleDifficulty = (difficulty: QuestDifficulty) => {
    telegram.selectionChanged();
    setFilters({
      ...filters,
      difficulty: filters.difficulty === difficulty ? undefined : difficulty,
    });
  };

  const clearFilters = () => {
    telegram.impactOccurred('light');
    setFilters({});
    setSearchQuery('');
  };

  const activeFiltersCount = (filters.category_id ? 1 : 0) + (filters.difficulty ? 1 : 0);

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
      {/* Поиск */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: theme.colors.background,
          padding: '12px 20px',
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: theme.colors.surface,
              padding: '12px 16px',
              borderRadius: theme.borderRadius.md + 'px',
            }}
          >
            <Search size={20} color={theme.colors.textSecondary} />
            <input
              type="text"
              placeholder="Поиск квестов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: theme.colors.text,
                fontSize: '15px',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ ...filters, search: undefined });
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                <X size={20} color={theme.colors.textSecondary} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: theme.borderRadius.md + 'px',
              backgroundColor: showFilters ? theme.colors.primary : theme.colors.surface,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <SlidersHorizontal size={20} color={showFilters ? '#FFFFFF' : theme.colors.text} />
            {activeFiltersCount > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  backgroundColor: theme.colors.error,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                }}
              >
                {activeFiltersCount}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Панель фильтров */}
      {showFilters && (
        <div
          style={{
            backgroundColor: theme.colors.surface,
            padding: '16px 20px',
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* Категории */}
          {categories.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: theme.colors.textSecondary,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Категория
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', overflowX: 'auto' }}>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '999px',
                      border: `2px solid ${
                        filters.category_id === category.id
                          ? category.color || theme.colors.primary
                          : theme.colors.border
                      }`,
                      backgroundColor:
                        filters.category_id === category.id
                          ? category.color || theme.colors.primary
                          : theme.colors.background,
                      color:
                        filters.category_id === category.id ? '#FFFFFF' : theme.colors.text,
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Сложность */}
          <div style={{ marginBottom: activeFiltersCount > 0 ? '16px' : 0 }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: theme.colors.textSecondary,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Сложность
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(DIFFICULTY_LEVELS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => toggleDifficulty(key as QuestDifficulty)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    border: `2px solid ${
                      filters.difficulty === key ? config.color : theme.colors.border
                    }`,
                    backgroundColor:
                      filters.difficulty === key ? config.color : theme.colors.background,
                    color: filters.difficulty === key ? '#FFFFFF' : theme.colors.text,
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Сброс */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              style={{
                background: 'none',
                border: 'none',
                color: theme.colors.error,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '8px 0',
                display: 'block',
                margin: '0 auto',
              }}
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}

      {/* Список квестов */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {quests.length > 0 ? (
          quests.map((quest, index) => (
            <div
              key={quest.id}
              style={{
                animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
              }}
            >
              <Card
                variant="glass"
                onClick={() => {
                  telegram.impactOccurred('light');
                  navigate(`/quest/${quest.id}`);
                }}
              >
                {/* Цветной акцент */}
                <div
                  style={{
                    height: '4px',
                    backgroundColor: quest.category?.color || theme.colors.primary,
                    margin: '-16px -16px 12px',
                    borderRadius: `${theme.borderRadius.lg}px ${theme.borderRadius.lg}px 0 0`,
                  }}
                />

                {/* Заголовок */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <h3
                    style={{
                      flex: 1,
                      fontSize: '18px',
                      fontWeight: '700',
                      color: theme.colors.text,
                      margin: 0,
                      letterSpacing: '-0.3px',
                    }}
                  >
                    {quest.title}
                  </h3>
                  <ArrowRight size={20} color={theme.colors.textLight} />
                </div>

                {/* Описание */}
                {quest.description && (
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: theme.colors.textSecondary,
                      margin: '0 0 12px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {quest.description}
                  </p>
                )}

                {/* Мета */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: quest.estimated_duration || quest.total_distance ? '8px' : 0,
                  }}
                >
                  {quest.category && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                          color: quest.category.color || theme.colors.primary,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {quest.category.name}
                      </span>
                    </div>
                  )}

                  {quest.difficulty && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap
                        size={12}
                        color={DIFFICULTY_LEVELS[quest.difficulty].color}
                        fill={DIFFICULTY_LEVELS[quest.difficulty].color}
                      />
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: DIFFICULTY_LEVELS[quest.difficulty].color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {DIFFICULTY_LEVELS[quest.difficulty].label}
                      </span>
                    </div>
                  )}

                  <div style={{ flex: 1 }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} color={theme.colors.warning} fill={theme.colors.warning} />
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: theme.colors.textSecondary,
                      }}
                    >
                      {quest.points_reward || 0}
                    </span>
                  </div>
                </div>

                {/* Дополнительно */}
                {(quest.estimated_duration || quest.total_distance) && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {quest.estimated_duration && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} color={theme.colors.textSecondary} />
                        <span
                          style={{ fontSize: '12px', color: theme.colors.textSecondary }}
                        >
                          {quest.estimated_duration}м
                        </span>
                      </div>
                    )}
                    {quest.total_distance && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} color={theme.colors.textSecondary} />
                        <span
                          style={{ fontSize: '12px', color: theme.colors.textSecondary }}
                        >
                          {(quest.total_distance / 1000).toFixed(1)}км
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: 'center',
              paddingTop: '80px',
              paddingBottom: '80px',
            }}
          >
            <Target size={64} color={theme.colors.textLight} />
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: theme.colors.textSecondary,
                marginTop: '16px',
                marginBottom: '4px',
              }}
            >
              Квесты не найдены
            </h3>
            <p style={{ fontSize: '14px', color: theme.colors.textLight }}>
              Попробуйте изменить фильтры
            </p>
          </div>
        )}
      </div>
    </div>
  );
};