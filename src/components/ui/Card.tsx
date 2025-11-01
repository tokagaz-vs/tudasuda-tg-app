import type { CSSProperties, ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'gradient';
  gradient?: readonly [string, string];
  onPress?: () => void;
  onClick?: () => void;
  style?: CSSProperties;
  padding?: number;
}

export const Card = ({
  children,
  variant = 'default',
  gradient,
  onPress,
  onClick,
  style,
  padding = 16,
}: CardProps) => {
  const { theme } = useTheme();

  const handleClick = () => {
    if (onPress) onPress();
    if (onClick) onClick();
  };

  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: theme.colors.glass,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.colors.border}`,
        };
      case 'gradient':
        return {
          background: gradient
            ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
            : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
          border: 'none',
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
        };
    }
  };

  const cardStyles: CSSProperties = {
    padding: `${padding}px`,
    borderRadius: theme.borderRadius.lg + 'px',
    cursor: onPress || onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    ...getVariantStyles(),
    ...style,
  };

  return (
    <div
      onClick={handleClick}
      style={cardStyles}
      onMouseEnter={(e) => {
        if (onPress || onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = theme.shadows.lg.boxShadow;
        }
      }}
      onMouseLeave={(e) => {
        if (onPress || onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = theme.shadows.sm.boxShadow;
        }
      }}
    >
      {children}
    </div>
  );
};