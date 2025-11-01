import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import type { TelegramUser } from '../types';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    
    console.log('📱 Telegram WebApp initialized');
    console.log('📱 Platform:', WebApp.platform);
    console.log('📱 Version:', WebApp.version);
    console.log('📱 InitData:', WebApp.initData);
    console.log('📱 InitDataUnsafe:', WebApp.initDataUnsafe);
    
    if (WebApp.initDataUnsafe.user) {
      const telegramUser = WebApp.initDataUnsafe.user as TelegramUser;
      console.log('👤 Telegram User:', telegramUser);
      setUser(telegramUser);
    } else {
      console.warn('⚠️ No Telegram user data available');
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