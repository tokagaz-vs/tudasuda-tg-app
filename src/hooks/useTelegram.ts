import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import type { TelegramUser } from '../types';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    
    if (WebApp.initDataUnsafe.user) {
      setUser(WebApp.initDataUnsafe.user as TelegramUser);
    }
  }, []);

  return {
    webApp: WebApp,
    user,
    isAuthenticated: !!user,
    platform: WebApp.platform,
    colorScheme: WebApp.colorScheme,
    themeParams: WebApp.themeParams,
  };
};