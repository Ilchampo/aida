import { OpenRouter } from '@openrouter/sdk';

import config from '@lib/config';

class OpenRouterInstance {
    private static instance: OpenRouterInstance | null = null;
    readonly client: OpenRouter;
    readonly interviewerModel: string;
    readonly evaluationModel: string;

    private constructor() {
        this.client = new OpenRouter({
            apiKey: config.openRouter.apiKey,
        });

        this.interviewerModel = config.openRouter.interviewerModel;
        this.evaluationModel = config.openRouter.evaluationModel;
    }

    static getInstance(): OpenRouterInstance {
        OpenRouterInstance.instance ??= new OpenRouterInstance();

        return OpenRouterInstance.instance;
    }
}

export const openRouterInstance = OpenRouterInstance.getInstance();
