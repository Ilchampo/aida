import { useAuthStore } from '@stores/auth.store';

export const useAuth = () => {
    const user = useAuthStore((state) => state.user);
    const status = useAuthStore((state) => state.status);

    const bootstrap = useAuthStore((state) => state.bootstrap);
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
    const logout = useAuthStore((state) => state.logout);
    const refreshMe = useAuthStore((state) => state.refreshMe);

    const isAuthenticated = status === 'authenticated';
    const isLoading = status === 'idle' || status === 'loading';

    return {
        user,
        status,
        bootstrap,
        loginWithGoogle,
        logout,
        refreshMe,
        isAuthenticated,
        isLoading,
    };
};
