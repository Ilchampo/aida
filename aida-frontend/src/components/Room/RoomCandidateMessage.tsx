import React from 'react';

interface RoomCandidateMessageProps {
    content: string;
}

const RoomCandidateMessage: React.FC<RoomCandidateMessageProps> = (props) => {
    const { content } = props;

    return (
        <div className="flex w-full justify-end">
            <div className="max-w-[90%] rounded-lg rounded-tr-sm border border-indigo-500/30 bg-indigo-500/10 p-4">
                <p className="text-sm leading-relaxed text-slate-200">{content}</p>
            </div>
        </div>
    );
};

export default RoomCandidateMessage;
