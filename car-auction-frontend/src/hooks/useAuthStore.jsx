import { create } from 'zustand';
import { refreshApi } from '../api/axios';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  loading: true,

  setAuth: (user, accessToken) => set({ user, accessToken }),
  updateUser: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),

  clearAuth: () => set({ user: null, accessToken: null }),

  refreshAccessToken: async () => {
    try {
      // console.log('refreshAccessToken');
      const response = await refreshApi.post(
        '/user/refresh-token',
        {},
        { withCredentials: true }
      );
      // console.log(response.data.accessToken);

      const newToken = response.data.accessToken;
      set({ accessToken: newToken });
      return newToken;
    } catch (error) {
      console.error('Refresh failed', error.response?.data || error.message);
      get().clearAuth();
      return null;
    }
  },

  loadUser: async () => {
    try {
      const response = await refreshApi.post(
        '/user/refresh-token',
        {},
        { withCredentials: true }
      );
      const { accessToken, user } = response.data;
      set({ user, accessToken, loading: false });
      return true;
    } catch (error) {
      console.log('No active session');
      set({ loading: false });
      return false;
    }
  },
}));

export default useAuthStore;
