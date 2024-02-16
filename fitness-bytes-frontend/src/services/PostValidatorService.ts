

import { z } from 'zod';

export const MAX_CHAR = 250;

export const schema = z.object({
	content: z
		.string()
		.min(1, { message: "Post must be at least 1 characters long." })
        .max(MAX_CHAR, { message: `Posts can only be up to ${MAX_CHAR} characters long`}),
});

export type FormData = z.infer<typeof schema>;