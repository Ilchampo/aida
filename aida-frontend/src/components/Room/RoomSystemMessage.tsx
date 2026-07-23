import React from 'react';

interface RoomSystemMessageProps {
    content: string;
    roleLabel: string;
}

const RoomSystemMessage: React.FC<RoomSystemMessageProps> = (props) => {
    const { content, roleLabel } = props;

    return (
        <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-indigo-500/20" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                {content} · {roleLabel}
            </span>
            <span className="h-px flex-1 bg-indigo-500/20" aria-hidden="true" />
        </div>
    );
};

export default RoomSystemMessage;
