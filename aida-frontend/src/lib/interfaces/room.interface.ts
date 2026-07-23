export type RoomInterviewState = 'idle' | 'listening' | 'transcribing' | 'thinking';

export type RoomMessageType = 'system' | 'ai' | 'candidate';

export interface RoomMessage {
    id: string;
    type: RoomMessageType;
    content: string;
}
