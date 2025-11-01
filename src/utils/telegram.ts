import WebApp from '@twa-dev/sdk';

export const telegram = {
  showBackButton: (onClick: () => void) => {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(onClick);
  },

  hideBackButton: () => {
    WebApp.BackButton.hide();
  },

  showMainButton: (text: string, onClick: () => void) => {
    WebApp.MainButton.setText(text);
    WebApp.MainButton.show();
    WebApp.MainButton.onClick(onClick);
  },

  hideMainButton: () => {
    WebApp.MainButton.hide();
  },

  setMainButtonText: (text: string) => {
    WebApp.MainButton.setText(text);
  },

  showAlert: (message: string) => {
    WebApp.showAlert(message);
  },

  showConfirm: (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      WebApp.showConfirm(message, resolve);
    });
  },

  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    WebApp.HapticFeedback.impactOccurred(style);
  },

  notificationOccurred: (type: 'error' | 'success' | 'warning') => {
    WebApp.HapticFeedback.notificationOccurred(type);
  },

  selectionChanged: () => {
    WebApp.HapticFeedback.selectionChanged();
  },

  openLink: (url: string, tryInstantView = false) => {
    WebApp.openLink(url, { try_instant_view: tryInstantView });
  },

  openTelegramLink: (url: string) => {
    WebApp.openTelegramLink(url);
  },

  close: () => {
    WebApp.close();
  },

  ready: () => {
    WebApp.ready();
  },

  expand: () => {
    WebApp.expand();
  },
};