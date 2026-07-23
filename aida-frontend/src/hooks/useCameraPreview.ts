import { useCallback, useEffect, useRef, useState } from 'react';

export type CameraPreviewStatus = 'idle' | 'requesting' | 'live' | 'denied' | 'unavailable';

interface UseCameraPreviewResult {
    status: CameraPreviewStatus;
    stream: MediaStream | null;
    enable: () => Promise<void>;
    disable: VoidFunction;
}

export const useCameraPreview = (): UseCameraPreviewResult => {
    const [status, setStatus] = useState<CameraPreviewStatus>('idle');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const stopStream = useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setStream(null);
    }, []);

    const disable = useCallback(() => {
        stopStream();
        setStatus('idle');
    }, [stopStream]);

    const enable = useCallback(async () => {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
            setStatus('unavailable');
            return;
        }

        setStatus('requesting');

        try {
            const nextStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false,
            });

            stopStream();
            streamRef.current = nextStream;
            setStream(nextStream);
            setStatus('live');
        } catch (error) {
            stopStream();

            if (
                error instanceof DOMException &&
                (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')
            ) {
                setStatus('denied');
                return;
            }

            setStatus('unavailable');
        }
    }, [stopStream]);

    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        };
    }, []);

    return { status, stream, enable, disable };
};
