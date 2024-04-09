
import { z } from 'zod';

export const MAX_CHAR = 250;

export const schema = z.object({
	content: z
		.string({description: "Nothing Submitted"})
		.min(1, { message: "Replies must be at least 1 characters long." })
        .max(MAX_CHAR, { message: `Replies can only be up to ${MAX_CHAR} characters long`}),
	});

export type ReplyData = z.infer<typeof schema>;