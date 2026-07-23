export const formatDurationFromSeconds = (seconds: number | null): string => {
    if (!seconds) {
        return '--';
    }

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m}m ${String(s).padStart(2, '0')}s`;
};

export const formatDurationBetween = (startedAt: string, endedAt: string | null): string => {
    if (!endedAt) {
        return '--';
    }

    const seconds = Math.round(
        (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000,
    );

    return formatDurationFromSeconds(seconds);
};
