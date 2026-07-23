import React, { useEffect, useMemo, useRef } from 'react';

import type { JobRole } from '@lib/interfaces/job.interface';
import type { RoomMessage } from '@lib/interfaces/room.interface';

import RoomAiMessage from '@components/Room/RoomAiMessage';
import RoomCandidateMessage from '@components/Room/RoomCandidateMessage';
import RoomSystemMessage from '@components/Room/RoomSystemMessage';

interface RoomCommsLogProps {
    messages: RoomMessage[];
    role: JobRole;
}

const RoomCommsLog: React.FC<RoomCommsLogProps> = (props) => {
    const { messages, role } = props;
    const bottomRef = useRef<HTMLDivElement>(null);
    const lastMessageIdRef = useRef<string | null>(null);

    useEffect(() => {
        const lastMessage = messages.at(-1);

        if (!lastMessage || lastMessage.id === lastMessageIdRef.current) {
            return;
        }

        lastMessageIdRef.current = lastMessage.id;
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages]);

    const latestAiMessageId = useMemo(() => {
        for (let index = messages.length - 1; index >= 0; index -= 1) {
            if (messages[index]?.type === 'ai') {
                return messages[index].id;
            }
        }

        return null;
    }, [messages]);

    return (
        <div className="flex-1 space-y-6 overflow-y-auto p-4">
            {messages.map((message) => {
                switch (message.type) {
                    case 'system':
                        return (
                            <RoomSystemMessage
                                key={message.id}
                                content={message.content}
                                roleLabel={role}
                            />
                        );
                    case 'candidate':
                        return <RoomCandidateMessage key={message.id} content={message.content} />;
                    default:
                        return (
                            <RoomAiMessage
                                key={message.id}
                                content={message.content}
                                isLatest={message.id === latestAiMessageId}
                            />
                        );
                }
            })}
            <div ref={bottomRef} aria-hidden="true" />
        </div>
    );
};

export default RoomCommsLog;
