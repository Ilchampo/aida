import React from 'react';

import { Loader2Icon } from 'lucide-react';

interface RoomLoadingScreenProps {
    message?: string;
}

const RoomLoadingScreen: React.FC<RoomLoadingScreenProps> = (props) => {
    const { message = '// initializing comms link...' } = props;

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-void-950">
            <Loader2Icon className="h-8 w-8 animate-spin text-cyan-400" aria-hidden="true" />
            <p className="mt-4 font-mono text-sm uppercase tracking-widest text-cyan-400/70">
                {message}
            </p>
        </div>
    );
};

export default RoomLoadingScreen;
