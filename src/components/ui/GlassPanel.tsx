import type { CSSProperties, ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface GlassPanelProps {
  children: ReactNode;
  style?: CSSProperties;
  padding?: number;
  borderRadius?: number;
  blur?: number;
}

export const GlassPanel = ({
  children,
  style,
  padding = 16,
  borderRadius,
  blur = 10,
}: GlassPanelProps) => {
  const { theme } = useTheme();

  const panelStyle: CSSProperties = {
    backgroundColor: theme.colors.glass,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid ${theme.colors.border}`,
    padding: `${padding}px`,
    borderRadius: `${borderRadius || theme.borderRadius.md}px`,
    ...style,
  };

  return <div style={panelStyle}>{children}</div>;
};