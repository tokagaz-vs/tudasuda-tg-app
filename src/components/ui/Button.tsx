import type { CSSProperties, ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { telegram } from '../../utils/telegram';

interface ButtonProps {
  title?: string;
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onPress?: () => void;
  onClick?: () => void;
  style?: CSSProperties;
  fullWidth?: boolean;
}

export const Button = ({
  title,
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  onPress,
  onClick,
  style,
  fullWidth = false,
}: ButtonProps) => {
  const { theme } = useTheme();

  const handleClick = () => {
    telegram.impactOccurred('medium');
    if (onPress) onPress();
    if (onClick) onClick();
  };

  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
          color: '#FFFFFF',
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          color: '#FFFFFF',
          border: 'none',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.primary,
          border: `2px solid ${theme.colors.primary}`,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.text,
          border: 'none',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): CSSProperties => {
    switch (size) {
      case 'small':
        return {
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: theme.borderRadius.sm + 'px',
        };
      case 'large':
        return {
          padding: '16px 32px',
          fontSize: '18px',
          borderRadius: theme.borderRadius.lg + 'px',
        };
      case 'medium':
      default:
        return {
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: theme.borderRadius.md + 'px',
        };
    }
  };

  const buttonStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.5 : 1,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style,
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      style={buttonStyles}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = theme.shadows.md.boxShadow;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {loading && <div className="spinner" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children || title}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};