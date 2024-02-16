
import { z } from 'zod';

const containsSpecialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
const noSpacesRegex = /^\S*$/;
const containsNumberRegex = /\d+/;
const containsCapitalLetterRegex = /[A-Z]+/;

const MIN_USERNAME_LENGTH = 10;
const MIN_PASSWORD_LENGTH = 3;

export const schema = z.object({
	username: z
		.string()
    .regex(noSpacesRegex, { message: "Username must not contain spaces" })
		.min(MIN_USERNAME_LENGTH, { message: `Username must be at least ${MIN_USERNAME_LENGTH}characters long.` }),

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
		.min(MIN_PASSWORD_LENGTH, { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` }),
});

export type FormData = z.infer<typeof schema>;