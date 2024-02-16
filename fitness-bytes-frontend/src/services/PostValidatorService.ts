

import { z } from 'zod';

export const schema = z.object({
	content: z
		.string()
		.min(1, { message: "Post must be at least 1 characters long." })
        .max(250),
});

export type FormData = z.infer<typeof schema>;