import React from 'react';

import { Loader2Icon } from 'lucide-react';

interface LoadingPanelProps {
    message: string;
    className?: string;
}

const LoadingPanel: React.FC<LoadingPanelProps> = (props) => {
    const { message, className = '' } = props;

    return (
        <div className={className}>
            <Loader2Icon className="h-8 w-8 animate-spin text-cyan-400" />
            <p className="font-mono text-sm uppercase tracking-widest text-cyan-400/70">
                {message}
            </p>
        </div>
    );
};

export default LoadingPanel;
