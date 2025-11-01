import WebApp from '@twa-dev/sdk';

export const telegram = {
  // Проверка поддержки функции
  isVersionAtLeast: (version: string) => {
    return WebApp.version >= version;
  },

  // Показать кнопку "Назад"
  showBackButton: (onClick: () => void) => {
    if (WebApp.BackButton) {
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(onClick);
    }
  },

  hideBackButton: () => {
    if (WebApp.BackButton) {
      WebApp.BackButton.hide();
    }
  },

  // Главная кнопка
  showMainButton: (text: string, onClick: () => void) => {
    if (WebApp.MainButton) {
      WebApp.MainButton.setText(text);
      WebApp.MainButton.show();
      WebApp.MainButton.onClick(onClick);
    }
  },

  hideMainButton: () => {
    if (WebApp.MainButton) {
      WebApp.MainButton.hide();
    }
  },

  setMainButtonText: (text: string) => {
    if (WebApp.MainButton) {
      WebApp.MainButton.setText(text);
    }
  },

  // Уведомления
  showAlert: (message: string) => {
    if (typeof WebApp.showAlert === 'function') {
      WebApp.showAlert(message);
    } else {
      alert(message);
    }
  },

  showConfirm: (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof WebApp.showConfirm === 'function') {
        WebApp.showConfirm(message, resolve);
      } else {
        resolve(confirm(message));
      }
    });
  },

  // Haptic feedback
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    try {
      if (WebApp.HapticFeedback?.impactOccurred) {
        WebApp.HapticFeedback.impactOccurred(style);
      }
    } catch (e) {
      // Haptic не поддерживается
    }
  },

  notificationOccurred: (type: 'error' | 'success' | 'warning') => {
    try {
      if (WebApp.HapticFeedback?.notificationOccurred) {
        WebApp.HapticFeedback.notificationOccurred(type);
      }
    } catch (e) {
      // Haptic не поддерживается
    }
  },

  selectionChanged: () => {
    try {
      if (WebApp.HapticFeedback?.selectionChanged) {
        WebApp.HapticFeedback.selectionChanged();
      }
    } catch (e) {
      // Haptic не поддерживается
    }
  },

  // Открыть ссылку
  openLink: (url: string, tryInstantView = false) => {
    if (typeof WebApp.openLink === 'function') {
      WebApp.openLink(url, { try_instant_view: tryInstantView });
    } else {
      window.open(url, '_blank');
    }
  },

  openTelegramLink: (url: string) => {
    if (typeof WebApp.openTelegramLink === 'function') {
      WebApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  },

  // Закрыть приложение
  close: () => {
    if (typeof WebApp.close === 'function') {
      WebApp.close();
    }
  },

  // Готовность
  ready: () => {
    WebApp.ready();
  },

  // Развернуть
  expand: () => {
    if (typeof WebApp.expand === 'function') {
      WebApp.expand();
    }
  },

  // Получить версию
  getVersion: () => {
    return WebApp.version || '6.0';
  },

  // Получить платформу
  getPlatform: () => {
    return WebApp.platform || 'unknown';
  },
};