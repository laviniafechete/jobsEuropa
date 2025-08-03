import { useSnackbarStore } from '../stores/snackbarStore';

export const useSnackbar = () => {
  const { addMessage } = useSnackbarStore();

  const showSuccess = (message: string, duration?: number) => {
    addMessage(message, 'success', duration);
  };

  const showError = (message: string, duration?: number) => {
    addMessage(message, 'error', duration);
  };

  const showWarning = (message: string, duration?: number) => {
    addMessage(message, 'warning', duration);
  };

  const showInfo = (message: string, duration?: number) => {
    addMessage(message, 'info', duration);
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}; 