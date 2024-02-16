
import { z } from 'zod';

const containsSpecialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
const noSpacesRegex = /^\S*$/;
const containsNumberRegex = /\d+/;
const containsCapitalLetterRegex = /[A-Z]+/;

export const schema = z.object({
	username: z
		.string()
    .regex(noSpacesRegex, { message: "Username must not contain spaces" })
		.min(3, { message: "Username must be at least 3 characters long." }),

	password: z
		.string()
		.regex(containsSpecialCharRegex, {
			message: "Password should contain at least 1 special character",
		})
		.regex(noSpacesRegex, { message: "Password should not contain spaces" })
		.regex(containsNumberRegex, {
			message: "Password should contain at least 1 number",
		})
		.regex(containsCapitalLetterRegex, {
			message: "Password should contain at least 1 capital letter",
		})
		.min(10, { message: "Password must be at least 10 characters long." }),
});

export type FormData = z.infer<typeof schema>;