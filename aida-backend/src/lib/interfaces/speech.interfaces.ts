export interface SynthesizeSpeechBody {
    text: string;
}

export interface SynthesizeSpeechResponse {
    audio: string | null;
    contentType: string | null;
    speechFailed: boolean;
}
