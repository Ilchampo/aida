import React from 'react';

import { Loader2Icon } from 'lucide-react';

const AuthLoadingScreen: React.FC = () => (
    <div className="flex min-h-screen items-center justify-center bg-void-950">
        <Loader2Icon className="h-8 w-8 animate-spin text-cyan-400" aria-label="Loading" />
    </div>
);

export default AuthLoadingScreen;
