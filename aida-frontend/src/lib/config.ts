import type { Config } from '@lib/interfaces/config.interface';

export const config: Config = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
};

console.log('config', config);
