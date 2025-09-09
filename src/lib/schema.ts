import { z } from "zod";

export const CreatorSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
    description: z.string().min(1, "Description is required").max(500, "Description must be 500 characters or less"),
    author: z.string().min(1, "Author is required").max(50, "Author must be 50 characters or less"),
    image: z.string().url("Image must be a valid URL").min(1, "Image URL is required").or(z.literal("")),
});

export const TipperSchema = z.object({
    value: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
});
