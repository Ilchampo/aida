import React from 'react';

interface ErrorPanelProps {
    message: string;
    className?: string;
}

const ErrorPanel: React.FC<ErrorPanelProps> = (props: ErrorPanelProps) => {
    const { message, className = '' } = props;

    return (
        <div className={className}>
            <p className="font-mono text-sm uppercase tracking-widest text-red-400">{message}</p>
        </div>
    );
};

export default ErrorPanel;
