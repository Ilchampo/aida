export const INTERVIEW_ANSWER_MAX_SECONDS = 60 as const;

export const INTERVIEW_MAX_QUESTIONS = 12 as const;

export const EMPTY_SPEECH_MESSAGE = "Didn't catch that — try again.";

export const DIDNT_UNDERSTAND_SPEECH = "Sorry, I didn't catch that. Please try again.";

export const STT_FAILED_MESSAGE = "We couldn't transcribe your answer. Please try speaking again.";

export const MIN_RECORDING_MS = 800 as const;

export const MIN_AUDIO_BYTES = 1024 as const;

export const TTS_PLAYBACK_FAILED_MESSAGE = 'Voice playback failed — read the message below.';

export const TURN_SUBMIT_RETRY_MESSAGE =
    'Unable to submit your answer. Check your connection and try again.';

export const MICROPHONE_DENIED_MESSAGE =
    'Microphone access is required for voice interviews. Allow microphone access in your browser settings and try again.';

export const SPEECH_UNSUPPORTED_MESSAGE =
    'Voice interviews require a browser with microphone and audio playback support.';

export const ROOM_WELCOME_TEMPLATE =
    "Hello! I'll be your interviewer for the {jobTitle} role. We'll discuss your experience and how you approach problems for this {role} position. When you're ready, tap Speak and introduce yourself.";

export const ROOM_GOODBYE_TEMPLATE =
    'Thank you — that completes our interview for {jobTitle}. You can return to the role page while our team reviews your session.';

export interface RoomCopyParams {
    jobTitle: string;
    role: string;
}

export const formatRoomWelcome = ({ jobTitle, role }: RoomCopyParams): string =>
    ROOM_WELCOME_TEMPLATE.replace('{jobTitle}', jobTitle).replace('{role}', role);

export const formatRoomGoodbye = ({ jobTitle }: Pick<RoomCopyParams, 'jobTitle'>): string =>
    ROOM_GOODBYE_TEMPLATE.replace('{jobTitle}', jobTitle);

export const formatQuestionCounter = (questionCount: number): string => `${questionCount}`;

export const formatRecordingTimer = (elapsedSeconds: number): string => {
    const clamped = Math.min(Math.max(elapsedSeconds, 0), INTERVIEW_ANSWER_MAX_SECONDS);
    const minutes = Math.floor(clamped / 60);
    const seconds = clamped % 60;

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const ROOM_STATE_LABELS = {
    idle: 'Ready',
    listening: 'Listening',
    transcribing: 'Transcribing',
    thinking: 'Thinking',
} as const;
