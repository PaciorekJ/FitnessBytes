import { z } from 'zod';

const containsSpecialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
const noSpacesRegex = /^\S*$/;
const containsNumberRegex = /\d+/;
// const containsCapitalLetterRegex = /[A-Z]+/;

const MIN_USERNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 3;

export const schema = z.object({
	username: z
		.string()
		.regex(noSpacesRegex, { message: "Username must not contain spaces" })
		.min(MIN_USERNAME_LENGTH, { message: `Username must be at least ${MIN_USERNAME_LENGTH} characters long.` }),

	password: z
		.string()
		.regex(containsSpecialCharRegex, {message: "Password should contain at least 1 special character",})
		.regex(noSpacesRegex, { message: "Password should not contain spaces" })
		.regex(containsNumberRegex, {message: "Password should contain at least 1 number",})
		.min(MIN_PASSWORD_LENGTH, { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` }),
});

export const usernameSchema = z.object({
	username: z
		.string()
		.regex(noSpacesRegex, { message: "Username must not contain spaces" })
		.min(MIN_USERNAME_LENGTH, { message: `Username must be at least ${MIN_USERNAME_LENGTH} characters long.` }),

})

export type AuthData = z.infer<typeof schema>;
export type AuthUsername = z.infer<typeof usernameSchema>;