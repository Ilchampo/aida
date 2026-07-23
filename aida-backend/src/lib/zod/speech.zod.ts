import { z } from 'zod';

const isoDateTimeSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Invalid ISO date',
});

export const submitTurnMetadataSchema = z.object({
    startedAt: isoDateTimeSchema,
    endedAt: isoDateTimeSchema,
    clientTurnId: z.uuid({ message: 'Invalid client turn id' }),
    format: z
        .string()
        .trim()
        .transform((value) => (value.length === 0 ? undefined : value.toLowerCase()))
        .optional(),
});

export const synthesizeSpeechBodySchema = z.object({
    text: z.string().trim().min(1, { message: 'Text cannot be empty' }),
});
