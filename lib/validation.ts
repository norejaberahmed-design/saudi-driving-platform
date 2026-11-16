import { z } from "zod";

export const quizSubmissionSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string().min(1).max(80),
    selectedIndex: z.number().int().min(0).max(5)
  })).min(1).max(30),
  visitorKey: z.string().uuid().optional()
}).strict();

export const signUpSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(128)
});