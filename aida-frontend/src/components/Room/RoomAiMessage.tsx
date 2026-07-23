import React from 'react';

interface RoomAiMessageProps {
    content: string;
    isLatest: boolean;
}

const RoomAiMessage: React.FC<RoomAiMessageProps> = (props) => {
    const { content, isLatest } = props;

    return (
        <div className="flex w-full">
            <div
                className={`relative max-w-[90%] overflow-hidden rounded-lg rounded-tl-sm border p-4 ${isLatest ? 'border-cyan-400/40 bg-cyan-400/5 shadow-glow-cyan' : 'border-slate-700 bg-void-800/60'}`}
            >
                {isLatest && (
                    <span
                        className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-cyan-300 to-indigo-400"
                        aria-hidden="true"
                    />
                )}
                <p
                    className={`text-sm leading-relaxed ${isLatest ? 'pl-2 font-medium text-slate-100' : 'text-slate-300'}`}
                >
                    {content}
                </p>
            </div>
        </div>
    );
};

export default RoomAiMessage;
