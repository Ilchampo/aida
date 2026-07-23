import React, { useCallback, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useActiveInterview } from '@hooks/useActiveInterview';
import { useInterviewSession } from '@hooks/useInterviewSession';
import { useRoomJob } from '@hooks/useRoomJob';
import { accentForIndex } from '@lib/utils/color.util';
import { isSpeechSupported } from '@lib/utils/speech.util';

import RoomActiveSessionGate from '@components/Room/RoomActiveSessionGate';
import RoomAppliedState from '@components/Room/RoomAppliedState';
import RoomCommsPanel from '@components/Room/RoomCommsPanel';
import RoomErrorState from '@components/Room/RoomErrorState';
import RoomHeader from '@components/Room/RoomHeader';
import RoomLoadingScreen from '@components/Room/RoomLoadingScreen';
import RoomUnsupportedBrowser from '@components/Room/RoomUnsupportedBrowser';
import RoomViewport from '@components/Room/RoomViewport';

const RoomPage: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();

    const { job, loading, error, remainingAttempts, retry } = useRoomJob(jobId);
    const {
        active,
        loading: activeLoading,
        refresh: refreshActive,
    } = useActiveInterview(Boolean(jobId));

    const backTo = jobId ? `/jobs/${jobId}` : '/';
    const accent = accentForIndex(0);
    const speechSupported = isSpeechSupported();
    const [leaving, setLeaving] = useState(false);

    const activeForThisJob = active && jobId && active.job._id === jobId ? active : null;
    const activeElsewhere = active && jobId && active.job._id !== jobId ? active : null;

    const handleComplete = useCallback(
        (interviewId: string) => {
            navigate(`/results/${interviewId}`);
        },
        [navigate],
    );

    const sessionEnabled = Boolean(
        jobId &&
        job &&
        !loading &&
        !activeLoading &&
        !error &&
        speechSupported &&
        !activeElsewhere &&
        (activeForThisJob || remainingAttempts > 0),
    );

    const {
        bootstrapping,
        preparingMic,
        sessionError,
        turnError,
        turnCanRetry,
        interviewState,
        messages,
        questionCount,
        isSpeaking,
        isRecording,
        recordingSeconds,
        toggleMic,
        statusLabel,
        micDisabled,
        leaveDisabled,
        retryBootstrap,
        clearTurnError,
        retryTurn,
        abandonSession,
    } = useInterviewSession({
        jobId: jobId ?? '',
        jobTitle: job?.title ?? '',
        role: job?.role ?? '',
        enabled: sessionEnabled,
        resumeInterviewId: activeForThisJob?._id ?? null,
        onComplete: handleComplete,
    });

    const handleLeave = useCallback(async () => {
        if (leaving) {
            return;
        }

        setLeaving(true);

        try {
            await abandonSession();
        } catch {
            console.error('Failed to abandon session');
        } finally {
            navigate(backTo);
        }
    }, [abandonSession, backTo, leaving, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [jobId]);

    if (loading || activeLoading) {
        return <RoomLoadingScreen message="// loading mission brief..." />;
    }

    if (error || !job || !jobId) {
        return (
            <RoomErrorState
                message={error ?? '// error: comms link failed'}
                backTo={backTo}
                onRetry={retry}
            />
        );
    }

    if (activeElsewhere) {
        return (
            <RoomActiveSessionGate
                active={activeElsewhere}
                currentJobId={jobId}
                onAbandoned={() => {
                    void refreshActive();
                }}
            />
        );
    }

    if (!activeForThisJob && remainingAttempts <= 0) {
        return <RoomAppliedState backTo={backTo} />;
    }

    if (!speechSupported) {
        return <RoomUnsupportedBrowser backTo={backTo} />;
    }

    if (bootstrapping) {
        return <RoomLoadingScreen message="// starting interview..." />;
    }

    if (preparingMic && !isSpeaking) {
        return <RoomLoadingScreen message="// connecting to interviewer..." />;
    }

    if (sessionError) {
        return <RoomErrorState message={sessionError} backTo={backTo} onRetry={retryBootstrap} />;
    }

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-void-950">
            <RoomHeader
                job={job}
                interviewState={interviewState}
                statusLabel={statusLabel}
                onLeave={handleLeave}
                leaveDisabled={leaving || leaveDisabled}
            />

            <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
                <RoomViewport accent={accent} isSpeaking={isSpeaking} />
                <RoomCommsPanel
                    messages={messages}
                    role={job.role}
                    interviewState={interviewState}
                    isSpeaking={isSpeaking}
                    isRecording={isRecording}
                    recordingSeconds={recordingSeconds}
                    questionCount={questionCount}
                    micDisabled={micDisabled}
                    turnError={turnError}
                    turnCanRetry={turnCanRetry}
                    onToggleMic={toggleMic}
                    onDismissTurnError={clearTurnError}
                    onRetryTurn={retryTurn}
                />
            </main>
        </div>
    );
};

export default RoomPage;
