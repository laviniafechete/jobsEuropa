import { create } from 'zustand';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarMessage {
  id: string;
  message: string;
  type: SnackbarType;
  duration?: number;
}

interface SnackbarStore {
  messages: SnackbarMessage[];
  addMessage: (message: string, type: SnackbarType, duration?: number) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

export const useSnackbarStore = create<SnackbarStore>((set, get) => ({
  messages: [],
  
  addMessage: (message: string, type: SnackbarType, duration = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newMessage: SnackbarMessage = {
      id,
      message,
      type,
      duration
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage]
    }));
    
    // Auto remove after duration
    setTimeout(() => {
      get().removeMessage(id);
    }, duration);
  },
  
  removeMessage: (id: string) => {
    set((state) => ({
      messages: state.messages.filter(msg => msg.id !== id)
    }));
  },
  
  clearMessages: () => {
    set({ messages: [] });
  }
})); 