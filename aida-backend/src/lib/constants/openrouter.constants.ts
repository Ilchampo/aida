export const OPENROUTER_INTERVIEWER_MAX_COMPLETION_TOKENS = 512 as const;

export const OPENROUTER_INTERVIEWER_TEMPERATURE = 0.3 as const;

export const OPENROUTER_EVALUATION_TEMPERATURE = 0.2 as const;

export const OPENROUTER_INTERVIEWER_PREFERRED_MAX_LATENCY_P50 = 5 as const;

export const OPENROUTER_STT_MODEL_DEFAULT = 'openai/whisper-1' as const;

export const OPENROUTER_TTS_MODEL_DEFAULT = 'google/gemini-3.1-flash-tts-preview' as const;

export const OPENROUTER_TTS_VOICE_DEFAULT = 'Zephyr' as const;

export const OPENROUTER_TTS_RESPONSE_FORMAT_DEFAULT = 'pcm' as const;

export const SPEECH_AUDIO_MAX_BYTES = 2 * 1024 * 1024;

export const SPEECH_MIN_RECORDING_BYTES = 1024 as const;

export const SPEECH_STT_LANGUAGE = 'en' as const;

export const SPEECH_TTS_CONTENT_TYPE = 'audio/mpeg' as const;
