const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const GIS_SCRIPT_ID = 'google-identity-services';

interface GoogleCredentialResponse {
    credential: string;
}

interface GoogleAccountsId {
    initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
    }) => void;
    renderButton: (
        parent: HTMLElement,
        options: {
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'large' | 'medium' | 'small';
            text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
            shape?: 'rectangular' | 'pill' | 'circle' | 'square';
            width?: number;
            logo_alignment?: 'left' | 'center';
        },
    ) => void;
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: GoogleAccountsId;
            };
        };
    }
}

let loadPromise: Promise<void> | null = null;

export const loadGoogleIdentityServices = (): Promise<void> => {
    if (window.google?.accounts?.id) {
        return Promise.resolve();
    }

    if (loadPromise) {
        return loadPromise;
    }

    loadPromise = new Promise((resolve, reject) => {
        const existing = document.getElementById(GIS_SCRIPT_ID);

        if (existing) {
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener(
                'error',
                () => reject(new Error('Failed to load Google Sign-In')),
                {
                    once: true,
                },
            );
            return;
        }

        const script = document.createElement('script');
        script.id = GIS_SCRIPT_ID;
        script.src = GIS_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => {
            loadPromise = null;
            reject(new Error('Failed to load Google Sign-In'));
        };
        document.head.appendChild(script);
    });

    return loadPromise;
};

export const renderGoogleSignInButton = async (params: {
    parent: HTMLElement;
    clientId: string;
    onCredential: (idToken: string) => void;
}): Promise<void> => {
    const { parent, clientId, onCredential } = params;

    if (!clientId) {
        throw new Error('Google Sign-In is not configured');
    }

    await loadGoogleIdentityServices();

    const googleId = window.google?.accounts?.id;

    if (!googleId) {
        throw new Error('Google Sign-In is unavailable');
    }

    parent.innerHTML = '';

    googleId.initialize({
        client_id: clientId,
        callback: (response) => {
            if (response.credential) {
                onCredential(response.credential);
            }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
    });

    googleId.renderButton(parent, {
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 320,
        logo_alignment: 'left',
    });
};
