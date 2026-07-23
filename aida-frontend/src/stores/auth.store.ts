import type { MeUser, PublicUser } from '@lib/interfaces/user.interface';

import { create } from 'zustand';

import * as authApi from '@api/auth.api';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
    user: MeUser | PublicUser | null;
    status: AuthStatus;
    bootstrap: () => Promise<void>;
    loginWithGoogle: (idToken: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    status: 'idle',

    bootstrap: async () => {
        const { status } = get();

        if (status !== 'idle') {
            return;
        }

        set({ status: 'loading' });

        try {
            const user = await authApi.getMe();

            set({ user, status: 'authenticated' });
        } catch {
            set({ user: null, status: 'unauthenticated' });
        }
    },

    loginWithGoogle: async (idToken) => {
        const signedIn = await authApi.signInWithGoogle({ idToken });

        try {
            const user = await authApi.getMe();
            set({ user, status: 'authenticated' });
        } catch {
            set({ user: signedIn, status: 'authenticated' });
        }
    },

    logout: async () => {
        try {
            await authApi.signOut();
        } finally {
            set({ user: null, status: 'unauthenticated' });
        }
    },

    refreshMe: async () => {
        if (get().status !== 'authenticated') {
            return;
        }

        try {
            const user = await authApi.getMe();
            set({ user });
        } catch {
            // Keep existing session user if refresh fails.
        }
    },
}));
