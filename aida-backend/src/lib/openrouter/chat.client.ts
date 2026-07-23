import config from '@lib/config';
import {
    OPENROUTER_EVALUATION_TEMPERATURE,
    OPENROUTER_INTERVIEWER_MAX_COMPLETION_TOKENS,
    OPENROUTER_INTERVIEWER_PREFERRED_MAX_LATENCY_P50,
    OPENROUTER_INTERVIEWER_TEMPERATURE,
} from '@constants/openrouter.constants';
import { openRouterInstance } from '@instances/openrouter.instance';

export type OpenRouterChatPurpose = 'interviewer' | 'evaluation';

export interface OpenRouterJsonSchemaResponseFormat {
    type: 'json_schema';
    jsonSchema: {
        name: string;
        strict: boolean;
        schema: Record<string, unknown>;
    };
}

export type OpenRouterChatMessage =
    | {
          role: 'system';
          content: string;
      }
    | {
          role: 'user';
          content:
              | string
              | Array<{
                    type: 'text';
                    text: string;
                    cacheControl?: {
                        type: 'ephemeral';
                    };
                }>;
      };

interface SendChatCompletionParams {
    purpose: OpenRouterChatPurpose;
    messages: OpenRouterChatMessage[];
    responseFormat: OpenRouterJsonSchemaResponseFormat;
    temperature?: number;
    sessionId?: string;
    maxCompletionTokens?: number;
}

type ChatCompletionContent = {
    choices: Array<{
        message: {
            content?: string | null;
        };
    }>;
};

export const isOpenRouterConfigured = (): boolean => config.openRouter.apiKey.trim().length > 0;

const extractAssistantContent = (
    result: ChatCompletionContent,
    purpose: OpenRouterChatPurpose,
): string => {
    const content = result.choices[0]?.message.content;

    if (typeof content !== 'string' || content.trim().length === 0) {
        throw new Error(`OpenRouter returned empty ${purpose} content`);
    }

    return content;
};

const resolveModel = (purpose: OpenRouterChatPurpose): string =>
    purpose === 'interviewer'
        ? openRouterInstance.interviewerModel
        : openRouterInstance.evaluationModel;

const resolveTemperature = (purpose: OpenRouterChatPurpose, temperature?: number): number =>
    temperature ??
    (purpose === 'interviewer'
        ? OPENROUTER_INTERVIEWER_TEMPERATURE
        : OPENROUTER_EVALUATION_TEMPERATURE);

export const sendChatCompletion = async (params: SendChatCompletionParams): Promise<string> => {
    const { purpose, messages, responseFormat, sessionId, maxCompletionTokens } = params;
    const temperature = resolveTemperature(purpose, params.temperature);

    const response = await openRouterInstance.client.chat.send({
        chatRequest: {
            model: resolveModel(purpose),
            messages,
            responseFormat,
            temperature,
            ...(sessionId !== undefined ? { sessionId } : {}),
            ...(maxCompletionTokens !== undefined ? { maxCompletionTokens } : {}),
            ...(purpose === 'interviewer'
                ? {
                      provider: {
                          preferredMaxLatency: OPENROUTER_INTERVIEWER_PREFERRED_MAX_LATENCY_P50,
                      },
                  }
                : {}),
        },
    });

    if (!('choices' in response)) {
        throw new Error(`OpenRouter streaming response is not supported for ${purpose}`);
    }

    return extractAssistantContent(response, purpose);
};

export const sendInterviewerChatCompletion = async (params: {
    messages: OpenRouterChatMessage[];
    responseFormat: OpenRouterJsonSchemaResponseFormat;
    sessionId: string;
}): Promise<string> =>
    sendChatCompletion({
        purpose: 'interviewer',
        messages: params.messages,
        responseFormat: params.responseFormat,
        sessionId: params.sessionId,
        maxCompletionTokens: OPENROUTER_INTERVIEWER_MAX_COMPLETION_TOKENS,
    });

export const sendEvaluationChatCompletion = async (params: {
    messages: OpenRouterChatMessage[];
    responseFormat: OpenRouterJsonSchemaResponseFormat;
}): Promise<string> =>
    sendChatCompletion({
        purpose: 'evaluation',
        messages: params.messages,
        responseFormat: params.responseFormat,
    });
