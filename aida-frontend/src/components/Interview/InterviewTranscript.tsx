import React from 'react';

import type { InterviewTranscriptTurn } from '@lib/interfaces/interview.interface';

import { useCallback, useState } from 'react';
import { BotIcon, UserIcon } from 'lucide-react';

import Collapsible from '@components/Common/Collapsible';

interface InterviewTranscriptProps {
    transcript: InterviewTranscriptTurn[];
}

const InterviewTranscript: React.FC<InterviewTranscriptProps> = (props) => {
    const { transcript } = props;

    const [open, setOpen] = useState(true);

    const toggleOpen = useCallback(() => {
        setOpen((current) => !current);
    }, []);

    return (
        <Collapsible title="Transcript" open={open} onToggle={toggleOpen}>
            <div className="max-h-96 space-y-4 overflow-y-auto border-t border-indigo-500/20 p-4">
                {transcript.map((turn) => {
                    const isAi = turn.speaker === 'ai';

                    return (
                        <div
                            key={turn.idx}
                            className={`flex gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
                        >
                            <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isAi ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300' : 'border-indigo-400/40 bg-indigo-400/10 text-indigo-300'}`}
                            >
                                {isAi ? (
                                    <BotIcon className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                    <UserIcon className="h-4 w-4" aria-hidden="true" />
                                )}
                            </div>
                            <div
                                className={`max-w-[80%] rounded-lg border px-4 py-2.5 text-sm leading-relaxed ${isAi ? 'border-cyan-400/20 bg-void-950 text-slate-300' : 'border-indigo-400/20 bg-indigo-500/5 text-slate-200'}`}
                            >
                                {turn.isFollowUp && (
                                    <span className="mb-1 block font-mono text-[9px] uppercase tracking-wider text-cyan-400/70">
                                        follow-up
                                    </span>
                                )}
                                {turn.text}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Collapsible>
    );
};

export default InterviewTranscript;
