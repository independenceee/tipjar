import { z } from "zod";

export const CreatorSchema = z
    .object({
        title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
        description: z.string().min(1, "Description is required").max(500, "Description must be 500 characters or less"),
        author: z.string().min(1, "Author is required").max(50, "Author must be 50 characters or less"),
        image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
        participants: z.number().min(2, "At least 2 participant is required").max(1000, "Participants cannot exceed 1000"),
    })
    .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
        message: "End date must be after start date",
        path: ["endDate"],
    });
export const TipperSchema = z.object({
    value: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
});
