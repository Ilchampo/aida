export interface AudioCaptureResult {
    audioBlob: Blob;
    startedAt: string;
    endedAt: string;
}

export interface SynthesizeSpeechResponse {
    audio: string | null;
    contentType: string | null;
    speechFailed: boolean;
}

export interface PlayableSpeech {
    audioBase64: string;
    contentType: string;
}
