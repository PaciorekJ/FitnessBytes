

import { z } from 'zod';

export const MAX_CHAR = 250;

export const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB

export const schema = z.object({
	content: z
		.string({description: "Nothing Submitted"})
		.min(1, { message: "Post must be at least 1 characters long." })
        .max(MAX_CHAR, { message: `Posts can only be up to ${MAX_CHAR} characters long`}),
	image: z
		.instanceof(File)
		.refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
		.optional()
	});

export type PostData = z.infer<typeof schema>;