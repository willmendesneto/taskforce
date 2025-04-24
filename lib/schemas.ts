import { z } from 'zod';

/**
 * Schema for user registration API
 */
export const userSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Schema for projects API
 */
export const projectSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
});

export type ProjectSchema = z.infer<typeof projectSchema>;

/**
 * Schema for tasks API
 */
export const taskSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional().nullable(),
	status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
	dueDate: z.string().optional().nullable(),
	projectId: z.number(),
});

/**
 * Schema for login form on Frontend
 */
export const loginFormSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	password: z.string().min(1, {
		message: 'Password is required.',
	}),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

/**
 * Schema for register form on Frontend
 */
export const registerFormSchema = z
	.object({
		name: z.string().min(2, {
			message: 'Name must be at least 2 characters.',
		}),
		email: z.string().email({
			message: 'Please enter a valid email address.',
		}),
		password: z.string().min(8, {
			message: 'Password must be at least 8 characters.',
		}),
		confirmPassword: z.string().min(8, {
			message: 'Password must be at least 8 characters.',
		}),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;

/**
 * Schema for task dialog form on Frontend
 */
export const taskDialogFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	status: z.enum(['todo', 'in_progress', 'done']),
	dueDate: z.string().optional(),
});

export type TaskDialogFormSchema = z.infer<typeof taskDialogFormSchema>;

/**
 * Schema for task form on Frontend
 */
export const taskFormSchema = z.object({
	title: z.string().min(1, 'Task title is required'),
});

export type TaskFormSchema = z.infer<typeof taskFormSchema>;
