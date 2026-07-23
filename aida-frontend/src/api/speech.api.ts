import type { SynthesizeSpeechResponse } from '@lib/interfaces/speech.interface';

import { apiCaller } from '@lib/utils/apiCaller';

export const synthesizeSpeech = (text: string): Promise<SynthesizeSpeechResponse> =>
    apiCaller<SynthesizeSpeechResponse>({
        method: 'POST',
        url: '/speech/synthesize',
        data: { text },
    });
